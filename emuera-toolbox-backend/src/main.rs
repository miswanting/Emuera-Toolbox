#![warn(missing_docs)]
// #![deny(missing_doc_code_examples)]
//! # Emuera Toolbox Backend
//! - [x] Start Server for FrontEnd.
//! - [x] Check `CSV` Folder;
//! - [x] Check `ERB` Folder;
//! - [x] Check `emuera.config` File;
//! - [x] Scan `File Paths`;
//! - [ ] Send `File Paths` to FrontEnd;
//! - [ ] FrontEnd UI;
//! - [ ] Display Working Directory Structure;
use chardetng::EncodingDetector;
use dialoguer::Confirm;
use indicatif::{MultiProgress, ProgressBar};
use std::collections::VecDeque;
use std::fs::{create_dir, read_dir, File};
use std::io::Read;
use std::path::PathBuf;
// use std::sync::{mpsc, Arc, Mutex};
use std::thread::{sleep, spawn};
use std::time::Duration;
use std::{io::Write, net::TcpListener};
use tungstenite::server::accept;

#[derive(Debug)]
struct Request {
    method: String,
    path: String,
    protocol: String,
    host: String,
    connection: String,
}
struct Scanner {
    folders: VecDeque<PathBuf>,
    files: VecDeque<PathBuf>,
}
impl Scanner {
    fn new(root: PathBuf) -> Scanner {
        let mut folders = VecDeque::new();
        folders.push_back(root);
        Scanner {
            folders,
            files: VecDeque::new(),
        }
    }
}
impl Iterator for Scanner {
    type Item = PathBuf;
    fn next(&mut self) -> Option<Self::Item> {
        while self.files.is_empty() {
            if self.folders.is_empty() {
                return None;
            } else {
                let path = self.folders.pop_front().unwrap();
                for entry in read_dir(path).unwrap() {
                    let entry_path = entry.unwrap().path();
                    if entry_path.is_dir() {
                        self.folders.push_back(entry_path);
                    } else if ["exe", "config", "csv", "erh", "erb"].contains(
                        &entry_path
                            .extension()
                            .unwrap()
                            .to_ascii_lowercase()
                            .to_str()
                            .unwrap(),
                    ) {
                        self.files.push_back(entry_path);
                    }
                }
            }
        }
        self.files.pop_front()
    }
}
fn main() {
    const HOST: &str = "localhost";
    const PORT: u16 = 11994;
    const WORKING_DIRECTORY: &str = "wd";
    // show_ui();
    start_server(HOST, PORT);
    // create_window();
    start_backend(WORKING_DIRECTORY);
    // check_folder_structure(WORKING_DIRECTORY);
    // let files = scan_folder(WORKING_DIRECTORY);
    // predict_encoding(files);
    // parse_cfg();
    // parse_csv();
    // parse_erh();
    // parse_erb();
}
// fn create_window_old() {
//     let event_loop = EventLoop::new();
//     let window = WindowBuilder::new()
//         .with_title("Hello World")
//         // .with_position(Position::Physical(PhysicalPosition::new(0, 0)))
//         // .with_inner_size(Size::Physical(PhysicalSize::new(500, 500)))
//         // .with_maximized(true)
//         .build(&event_loop)
//         .unwrap();
//     window.set_maximized(true);
//     let scale_rate = 9;
//     let monitor_size = window.current_monitor().unwrap().size();
//     let window_size = PhysicalSize::new(
//         monitor_size.width * scale_rate / 10,
//         monitor_size.height * scale_rate / 10,
//     );
//     window.set_outer_position(Position::Physical(PhysicalPosition::new(
//         ((monitor_size.width - window_size.width) / 2)
//             .try_into()
//             .unwrap(),
//         ((monitor_size.height - window_size.height) / 2)
//             .try_into()
//             .unwrap(),
//     )));
//     window.set_inner_size(window_size);
//     println!("{:?}", window.current_monitor().unwrap().size());
//     println!("{}", window.is_maximized());
//     // window.set_fullscreen(Fullscreen::Borderless(window.current_monitor()));
//     let webview = WebViewBuilder::new(window)
//         .unwrap()
//         .with_url("https://tauri.studio")
//         .unwrap()
//         .build()
//         .unwrap();

//     event_loop.run(move |event, _, control_flow| {
//         *control_flow = ControlFlow::Wait;
//         let ps = PhysicalSize::new(800, 600);
//         match event {
//             Event::NewEvents(StartCause::Init) => println!("Wry has started!"),
//             Event::WindowEvent {
//                 event: WindowEvent::CloseRequested,
//                 ..
//             } => *control_flow = ControlFlow::Exit,
//             Event::WindowEvent {
//                 event: WindowEvent::Resized(ps),
//                 ..
//             } => webview.resize().unwrap(),
//             _ => (),
//         }
//     });
// }

fn create_window() {
    use wry::{
        application::{
            event::{Event, StartCause, WindowEvent},
            event_loop::{ControlFlow, EventLoop},
            window::WindowBuilder,
        },
        webview::WebViewBuilder,
    };
    let event_loop = EventLoop::new();
    let window = WindowBuilder::new()
        .with_title("Emuera Toolbox")
        .build(&event_loop)
        .unwrap();
    println!("{:?}", window.current_monitor().unwrap().size());
    let _webview = WebViewBuilder::new(window)
        .unwrap()
        .with_url("https://tauri.studio")
        .unwrap()
        .build()
        .unwrap();
    event_loop.run(move |event, _, control_flow| {
        *control_flow = ControlFlow::Wait;

        match event {
            Event::NewEvents(StartCause::Init) => println!("Wry has started!"),
            Event::WindowEvent {
                event: WindowEvent::CloseRequested,
                ..
            } => *control_flow = ControlFlow::Exit,
            _ => (),
        }
    });
}
fn show_ui() {
    let bars = MultiProgress::new();
    let bar = bars.add(ProgressBar::new(100));
    spawn(move || {
        for _ in 0..100 {
            bar.inc(2);
            bar.inc_length(1);
            sleep(Duration::from_secs(1));
        }
        bar.finish();
    });
    bars.join_and_clear().unwrap();
}

fn start_server(host: &'static str, port: u16) {
    spawn(move || {
        let addr = format!("{}:{}", host, port);
        let listener = TcpListener::bind(addr.clone()).expect("msg");
        println!("http://{}/", addr);
        for stream in listener.incoming() {
            let mut stream = stream.expect("msg");
            let mut buf = [0; 128];
            stream.peek(&mut buf[..]).expect("msg");
            let raw_req = String::from_utf8_lossy(&buf[..]);
            let reqs: Vec<&str> = raw_req.split("\r\n").collect();
            let cmds: Vec<&str> = reqs[0].split(" ").collect();
            let hosts: Vec<&str> = reqs[1].split(":").collect();
            let connections: Vec<&str> = reqs[2].split(":").collect();
            let req = Request {
                method: cmds[0].to_string(),
                path: cmds[1].to_string(),
                protocol: cmds[2].to_string(),
                host: hosts[1].trim().to_string(),
                connection: connections[1].trim().to_string(),
            };
            if req.connection != "Upgrade" {
                let html = include_str!("main.rs");
                let res = format!(
                    "HTTP/1.1 200 OK\r\nContent-Length: {}\r\n\r\n{}",
                    html.len(),
                    html
                );
                stream.write(res.as_bytes()).unwrap();
                stream.flush().unwrap();
            } else {
                let mut websocket = accept(stream).unwrap();
                loop {
                    let msg = websocket.read_message().unwrap();
                    if msg.is_binary() || msg.is_text() {
                        websocket.write_message(msg).unwrap();
                    }
                }
            }
        }
    });
}
fn start_backend(wd: &'static str) {
    let root_path = PathBuf::from(wd);
    let mut tmp_path = PathBuf::from(root_path.clone());
    tmp_path.push("CSV");
    if !tmp_path.is_dir() {
        if Confirm::new()
            .with_prompt("CSV folder not found, Create one?")
            .default(true)
            .interact()
            .unwrap()
        {
            create_dir(tmp_path).unwrap();
        }
    }
    let mut tmp_path = PathBuf::from(root_path.clone());
    tmp_path.push("ERB");
    if !tmp_path.is_dir() {
        if Confirm::new()
            .with_prompt("ERB folder not found, Create one?")
            .default(true)
            .interact()
            .unwrap()
        {
            create_dir(tmp_path).unwrap();
        }
    }
    let mut tmp_path = PathBuf::from(root_path.clone());
    tmp_path.push("emuera.config");
    if !tmp_path.is_file() {
        if Confirm::new()
            .with_prompt("emuera.config file not found, Create one?")
            .interact()
            .unwrap()
        {
            todo!();
        }
    }
    let handle = spawn(move || {
        let scanner = Scanner::new(PathBuf::from(wd));
        for each in scanner {
            println!("{:?}", each);
        }
    });
    handle.join().unwrap();

    //
    // let (sx, rx) = mpsc::channel();
    // spawn(move || {
    //     let mut dirs: VecDeque<PathBuf> = VecDeque::new();
    //     let mut scan_path = |path| {
    //         for entry in read_dir(path).unwrap() {
    //             let entry_path = entry.unwrap().path();
    //             if entry_path.is_dir() {
    //                 {
    //                     dirs.push_back(entry_path);
    //                 }
    //             } else {
    //                 if ["exe", "config", "csv", "erh", "erb"].contains(
    //                     &entry_path
    //                         .extension()
    //                         .unwrap()
    //                         .to_ascii_lowercase()
    //                         .to_str()
    //                         .unwrap(),
    //                 ) {
    //                     sx.send(entry_path);
    //                 }
    //             }
    //         }
    //     };
    //     scan_path(PathBuf::from(wd));
    //     while !dirs.is_empty() {
    //         let path = dirs.pop_front().unwrap();
    //         scan_path(path);
    //     }
    // });
    //
    // let mut scaned_files: Arc<Mutex<VecDeque<PathBuf>>> = Arc::new(Mutex::new(VecDeque::new()));
    // spawn(move || {
    //     let mut dirs: VecDeque<PathBuf> = VecDeque::new();
    //     fn scan_path(files: &mut Vec<PathBuf>, dirs: &mut VecDeque<PathBuf>, path: PathBuf) {
    //         for entry in read_dir(path).unwrap() {
    //             let entry_path = entry.unwrap().path();
    //             if entry_path.is_dir() {
    //                 dirs.push_back(entry_path);
    //             } else {
    //                 if ["exe", "config", "csv", "erh", "erb"].contains(
    //                     &entry_path
    //                         .extension()
    //                         .unwrap()
    //                         .to_ascii_lowercase()
    //                         .to_str()
    //                         .unwrap(),
    //                 ) {
    //                     scaned_files.push_back(entry_path);
    //                 }
    //             }
    //         }
    //     }
    //     scan_path(&mut scaned_files, &mut dirs, PathBuf::from(wd));
    //     while !dirs.is_empty() {
    //         let path = dirs.pop_front().unwrap();
    //         scan_path(&mut scaned_files, &mut dirs, path);
    //     }
    //     for file in scaned_files {
    //         println!("{:?}", file);
    //     }
    // });
    //
}
fn check_folder_structure(wd: &str) {
    let root_path = PathBuf::from(wd);
    let mut tmp_path = PathBuf::from(root_path.clone());
    tmp_path.push("CSV");
    if !tmp_path.is_dir() {
        if Confirm::new()
            .with_prompt("CSV folder not found, Create one?")
            .default(true)
            .interact()
            .unwrap()
        {
            create_dir(tmp_path).unwrap();
        }
    }
    let mut tmp_path = PathBuf::from(root_path.clone());
    tmp_path.push("ERB");
    if !tmp_path.is_dir() {
        if Confirm::new()
            .with_prompt("ERB folder not found, Create one?")
            .default(true)
            .interact()
            .unwrap()
        {
            create_dir(tmp_path).unwrap();
        }
    }
    let mut tmp_path = PathBuf::from(root_path.clone());
    tmp_path.push("emuera.config");
    if !tmp_path.is_file() {
        if Confirm::new()
            .with_prompt("emuera.config file not found, Create one?")
            .interact()
            .unwrap()
        {
            todo!();
        }
    }
}
fn scan_folder(wd: &str) -> Vec<PathBuf> {
    let mut files: Vec<PathBuf> = Vec::new();
    let mut dirs: VecDeque<PathBuf> = VecDeque::new();
    fn scan_path(files: &mut Vec<PathBuf>, dirs: &mut VecDeque<PathBuf>, path: PathBuf) {
        for entry in read_dir(path).unwrap() {
            let entry_path = entry.unwrap().path();
            if entry_path.is_dir() {
                dirs.push_back(entry_path);
            } else {
                files.push(entry_path);
            }
        }
    }
    scan_path(&mut files, &mut dirs, PathBuf::from(wd));
    while !dirs.is_empty() {
        let path = dirs.pop_front().unwrap();
        scan_path(&mut files, &mut dirs, path);
    }
    files
}
fn predict_encoding(files: Vec<PathBuf>) {
    for file_path in files {
        let mut ed = EncodingDetector::new();
        let mut file = File::open(file_path.clone()).unwrap();
        let mut buf: Vec<u8> = Vec::new();
        file.read_to_end(&mut buf).unwrap();
        ed.feed(&buf, true);
        let e = ed.guess(None, true);
        println!("{:?}: {}", file_path, e.name());
    }
}
fn parse_cfg() {}
fn parse_csv() {}
fn parse_erh() {}
fn parse_erb() {}
