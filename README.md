# Browser-Bot

Browser-Bot is a powerful web application that leverages the Web Speech API to provide speech-to-text (STT) and text-to-speech (TTS) capabilities. It is designed to be highly configurable, making it suitable for a wide range of applications and use cases. With additional features like GPT support, this app becomes a versatile and powerful tool for voice-based interaction.

## Features

- Speech-to-Text (STT) support
- Text-to-Speech (TTS) support
- Configurable STT language, TTS voices, and parameters
- GPT OpenAI API integration (optional)
- Export and import configuration settings
- Log management and saving

## Usage

1. Open [browser-bot.html](https://johnson-yo.github.io/browser-bot.html) in a modern web browser that supports the Web Speech API.
2. Configure the app by clicking the `[CONFIG]` button and setting the desired options.
3. Test the STT and TTS features by clicking the corresponding buttons.
4. To use the GPT OpenAI API, enter your API key and other optional settings.

## Configuration Options

- REST URL: The REST API URL to send STT results.
- STT Language: The language used by the STT service.
- TTS Voice: The TTS voice settings (up to 4 different voices can be configured).
- TTS Volume, Rate, and Pitch: Customize the TTS output properties.
- STT Timeout: Maximum duration for STT listening.
- STT HotWords, AnswerWords, ConfirmWords, and CancelWords: Configure specific words to trigger actions.
- GPT OpenAI API Key, System Role, Token Limit, and Reply Language: Configure the GPT API integration (optional).

## Speak multiple languages

To use the SPEAK button with multiple languages, you can create a text input that includes language codes ([en], [zh], [jp]) before each sentence or phrase. For example:

INPUT = '[en]Hello, this is an English sentence. [zh]你好，这是一句中文。[jp]こんにちは、これは日本語です。';

This input will generate speech in the following order:

1. An English sentence: "Hello, this is an English sentence."
2. A Chinese sentence: "你好，这是一句中文。"
3. A Japanese sentence: "こんにちは、これは日本語の文です。"

Make sure to configure the appropriate TTS voices for each language using the `Voice1`, `Voice2`, `Voice3`, and `Voice4` settings in the user interface.

## Browser Compatibility

Browser-Bot relies on the Web Speech API, which is not supported by all browsers. Please use a modern browser like Google Chrome, Mozilla Firefox, or Microsoft Edge for the best experience.

## REST API URL Format:

The REST API URL is formed by concatenating the `restUrl` configuration value with the `query` value.

To create a valid REST API URL, the `restUrl` value should be a properly formatted base URL (e.g., `https://example.com/api/`). The `query` value will be appended to this base URL.

## Response Format:

The expected response from the REST API should be a JSON object containing a `message` property, as shown below:

```json
{
  "message": "Text to be spoken by the TTS system."
}
```

## Contributing

If you have any suggestions, bug reports, or feature requests, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/johnson-yo/johnson-yo.github.io).

## License

This project is licensed under the MIT License.
