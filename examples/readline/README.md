# Readline Effect example

This is a simple Node.js readline example that prompts the user to type something in the terminal, and then echo it back after the user presses return.

You can run it in one of two modes without any changes to the main program, real console IO, and no IO, simply by providing different handling implementations.

See the code for an even more detailed walkthrough.

### [main.js](main.js)

The main program. This prompts the user, reads user input, echoes it back, and then repeats until the user enters an empty string.

### [readline-effect.js](readline-effect.js)

A Node.js readline effect with operations for displaying a prompt, reading user input, and shutting down the readline, disconnecting it from stdin so that Node exits properly.

### [index.js](index.js)

Entrypoint that runs the main program with real IO effects.

```
node -r babel-register examples/readline/index
```

### [index-no-io.js](index-no-io.js)

Entrypoint that runs the _same main program_, but using effect handler implementations that don't do any real IO.

```
node -r babel-register examples/readline/index-no-io
```
