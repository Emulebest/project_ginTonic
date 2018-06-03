extern crate actix_web;
extern crate serde_json;

use actix_web::{HttpRequest, Result, Error};
use block::Transaction;
use std::collections::HashMap;
use actix_web::Json;
use transaction_types::*;
use wallets::Wallet;
use postgres::{Connection, TlsMode};
use processor::*;
use actix_web::Responder;

#[derive(Deserialize)]
pub struct WalletInfo {
    pub address: String
}

#[derive(Serialize, Deserialize, Clone)]
pub struct SendT {
    from: String,
    to: String,
    private_key: String,
    amount: i32
}

pub fn transaction_send(trans: Json<SendT>) -> Json<String> {
    println!("Hello");
    let mut trans_typer = trans.clone();
    let transaction = trans_typer.clone();
    let serialized = serde_json::to_string(&transaction).unwrap();
    println!("{}", serialized);
    let conn = Connection::connect("postgres://postgres:123@db:5432",
                                   TlsMode::None).unwrap();
    conn.execute("INSERT INTO transaction (data) VALUES ($1)",
                 &[&serialized]).unwrap();
    Json(serialized)
}

pub fn mine(pub_key: Json<WalletInfo>) -> Result<Json<String>> {
    let conn = Connection::connect("postgres://postgres:123@db:5432",
                                   TlsMode::None).unwrap();
    conn.execute("UPDATE wallet SET amount = amount+50 WHERE pub_key = $1",
                 &[&pub_key.address]).unwrap();
    for row in &conn.query("SELECT data FROM transaction", &[]).unwrap() {
        let data: String = row.get(0);
        let mut trans: Transaction = serde_json::from_str(&data).unwrap();
        match TransactionType::get_type(&mut trans) {
            Ok(t) => {
                println!("{:?}", t);
                match t {
                    TransactionType::SendTransaction => {
                        send_coins(trans);
                    },
                    TransactionType::RewardTransaction => {
                        get_reward(trans);
                    },
                    TransactionType::DeviceTransaction => {
                        device(trans);
                    },
                    TransactionType::UnknownTransaction => {
                        unknown(trans);
                    }
                };
            },
            Err(_) => {

            }
        }
    }
    conn.execute("DELETE FROM transaction", &[]).unwrap();
    Ok(Json("All transactions Okay".to_owned()))
}

pub fn get_amount(pub_key: Json<WalletInfo>) -> Json<HashMap<&'static str, i64>> {
    let mut okay = HashMap::new();
    let conn = Connection::connect("postgres://postgres:123@db:5432",
                                   TlsMode::None).unwrap();
    for row in &conn.query("SELECT amount FROM wallet WHERE pub_key = $1", &[&pub_key.address]).unwrap() {
        let amount: i64 = row.get(0);
        okay.insert("amount", amount);
    }
    Json(okay)
}


pub fn create_wallet(req: HttpRequest) -> Wallet {
    let new_wallet = Wallet::new();
    new_wallet
}

