use anyhow::Error;
use fluentci_pdk::dag;

pub fn setup_flutter() -> Result<(), Error> {
    dag().call(
        "https://pkg.fluentci.io/android_pipeline@v0.11.1?wasm=1",
        "setup",
        vec![],
    )?;

    let path = dag()
        .get_env("PATH")
        .unwrap_or("/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin".into());

    let home = dag().get_env("HOME").unwrap_or("/root".into());

    let mut flutter_version = dag().get_env("FLUTTER_VERSION").unwrap_or_default();

    if flutter_version.is_empty() {
        flutter_version = "3.13.1".into();
    }

    dag().set_envs(vec![(
        "PATH".into(),
        format!("{}:{}/.pub-cache/bin", path, home),
    )])?;

    dag().set_envs(vec![
        ("FLUTTER_HOME".into(), format!("{}/sdks/flutter", home)),
        ("FLUTTER_ROOT".into(), format!("{}/sdks/flutter", home)),
        (
            "PATH".into(),
            format!(
                "{}:{}/sdks/flutter/bin:{}/sdks/flutter/bin/cache/dart-sdk/bin:{}/.pub-cache/bin",
                path, home, home, home
            ),
        ),
        ("FLUTTER_VERSION".into(), flutter_version),
    ])?;

    let sdk_dir_ok = dag()
        .directory(".")?
        .with_exec(vec!["[ ! -d $FLUTTER_HOME ] || echo OK"])?
        .stdout()?;

    if sdk_dir_ok.contains("OK") {
        return Ok(());
    }

    dag().devbox()?
      .with_exec(vec!["devbox", "global", "add", "git"])?
      .with_exec(vec![r#"
        eval "$(devbox global shellenv --recompute)"
        mkdir -p $HOME/sdks
        git clone --depth 1 --branch $FLUTTER_VERSION https://github.com/flutter/flutter.git $FLUTTER_HOME"#
      ])?
      .with_exec(vec![
         "yes | flutter doctor --android-licenses && flutter doctor"
      ])?
      .with_exec(vec!["flutter", "precache", "--android"])?
      .stdout()?;

    Ok(())
}
