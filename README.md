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

## Browser Compatibility

Browser-Bot relies on the Web Speech API, which is not supported by all browsers. Please use a modern browser like Google Chrome, Mozilla Firefox, or Microsoft Edge for the best experience.

## Contributing

If you have any suggestions, bug reports, or feature requests, feel free to open an issue or submit a pull request on the [GitHub repository](https://github.com/).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
