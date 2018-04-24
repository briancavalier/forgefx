# Readline Effect example

This is a simple Node.js readline example that prompts the user to type something in the terminal, and then echoes it back after the user presses return.

Effect handlers enable it to be run in two different modes without any changes to the main program simply by providing different handler implementations.

1. [index.js](index.js): real console IO

    ```
    node -r babel-register examples/readline/index
    ```

2. [index-no-io.js](index-no-io.js): _no_ IO

    ```
    node -r babel-register examples/readline/index-no-io
    ```

See the code for a more detailed walkthrough.

### [main.js](main.js)

The main program. This prompts the user, reads user input, echoes it back, and then repeats until the user enters an empty string.

### [readline-effect.js](readline-effect.js)

A Node.js readline effect with operations for displaying a prompt, reading user input, and shutting down the readline, disconnecting it from stdin so that Node exits properly.

### [index.js](index.js)

Entrypoint that runs the main program with real IO effects.

### [index-no-io.js](index-no-io.js)

Entrypoint that runs the _same main program_, but using effect handler implementations that don't do any real IO.
