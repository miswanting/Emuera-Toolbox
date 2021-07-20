use chardetng::EncodingDetector;
use dialoguer::Confirm;
use indicatif::{MultiProgress, ProgressBar, ProgressStyle};
use std::collections::VecDeque;
use std::fs::{create_dir, read_dir, File};
use std::io::Read;
use std::path::PathBuf;
use std::thread::{sleep, spawn, Thread};
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

fn main() {
    const HOST: &str = "localhost";
    const PORT: u16 = 11994;
    const WORKING_DIRECTORY: &str = "cwd";
    // show_ui();
    // start_server(HOST, PORT);
    start_backend(WORKING_DIRECTORY);
    // check_folder_structure(WORKING_DIRECTORY);
    // let files = scan_folder(WORKING_DIRECTORY);
    // predict_encoding(files);
    // parse_cfg();
    // parse_csv();
    // parse_erh();
    // parse_erb();
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
fn start_backend(wd: &str) {
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
