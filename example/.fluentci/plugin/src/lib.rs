use extism_pdk::*;
use fluentci_pdk::dag;

use crate::helpers::setup_flutter;

pub mod helpers;

#[plugin_fn]
pub fn setup() -> FnResult<()> {
    setup_flutter()?;
    Ok(())
}

#[plugin_fn]
pub fn code_quality() -> FnResult<String> {
    setup_flutter()?;

    let stdout = dag()
        .devbox()?
        .with_exec(vec![
            "flutter",
            "pub",
            "global",
            "activate",
            "dart_code_metrics",
        ])?
        .with_exec(vec![
            "$HOME/.pub-cache/bin/metrics lib -r codeclimate  > gl-code-quality-report.json",
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn test() -> FnResult<String> {
    setup_flutter()?;

    let stdout = dag()
        .devbox()?
        .with_exec(vec!["devbox", "global", "add", "lcov@1.15"])?
        .with_exec(vec!["flutter", "pub", "global", "activate", "junitreport"])?
        .with_exec(vec![
            "flutter test --machine --coverage | $HOME/.pub-cache/bin/tojunit -o report.xml",
        ])?
        .with_exec(vec![
            r#"
            eval "$(devbox global shellenv --recompute)"
            lcov --capture --directory . --output-file coverage/lcov.info"#,
        ])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn build(args: String) -> FnResult<String> {
    setup_flutter()?;

    let stdout = dag()
        .devbox()?
        .with_exec(vec![
            r#"
        eval "$(devbox global shellenv --recompute)"
        flutter build"#,
            &args,
        ])?
        .stdout()?;
    Ok(stdout)
}
