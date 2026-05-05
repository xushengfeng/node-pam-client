use neon::prelude::*;
use std::thread;

fn authenticate(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let service = cx.argument::<JsString>(0)?.value(&mut cx);
    let username = cx.argument::<JsString>(1)?.value(&mut cx);
    let password = cx.argument::<JsString>(2)?.value(&mut cx);
    let callback = cx.argument::<JsFunction>(3)?.root(&mut cx);

    let channel = cx.channel();

    thread::spawn(move || {
        let mut client = match pam::client::Client::with_password(&service) {
            Ok(c) => c,
            Err(e) => {
                let err_msg = format!("Failed to initialize PAM client: {}", e);
                channel.send(move |mut cx| {
                    let callback = callback.into_inner(&mut cx);
                    let this = cx.undefined();
                    let err = cx.error(err_msg)?.upcast::<JsValue>();
                    let args = vec![err];
                    callback.call(&mut cx, this, args)?;
                    Ok(())
                });
                return;
            }
        };

        client
            .conversation_mut()
            .set_credentials(username, password);

        let result = client.authenticate();

        channel.send(move |mut cx| {
            let callback = callback.into_inner(&mut cx);
            let this = cx.undefined();
            let args = match result {
                Ok(_) => {
                    let null = cx.null().upcast::<JsValue>();
                    vec![null]
                }
                Err(e) => {
                    let err_msg = format!("Authentication failed: {}", e);
                    let err = cx.error(err_msg)?.upcast::<JsValue>();
                    vec![err]
                }
            };
            callback.call(&mut cx, this, args)?;
            Ok(())
        });
    });

    Ok(cx.undefined())
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("authenticate", authenticate)?;
    Ok(())
}
