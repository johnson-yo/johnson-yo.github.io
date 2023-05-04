// Auth: Johnson Yo
// Date: 2023/05/04
// Email: you.archi.2017@gmail.com

// create ids list
const config_ids = [
    // config ids
    'restUrl',
    'ttsVoice1', 'ttsVoice2', 'ttsVoice3', 'ttsVoice4',
    'ttsVoice1Select', 'ttsVoice2Select', 'ttsVoice3Select', 'ttsVoice4Select',
    'ttsVolume', 'ttsRate', 'ttsPitch',
    'sttLanguage', 'sttTimeout', 'sttHotwords', 'sttAnswers', 'sttConfirms', 'sttNoWords',
    'gptApiKey', 'gptSystemRole', 'gptTokenLimit', 'gptReplyLanguage',
];

const other_ids = [
    // button ids
    'configContent', 'configButton', 'commitButton', 'resetButton', 'exportButton', 'importButton',
    'listenHotwordButton', 'listenCommandButton', 'stopButton', 'sendButton',
    'speakButton',
    'cleanButton', 'saveButton',
    // i/o ids
    'ttsInput', 'sttStatus', 'sttOutput', 'logOutput',
];


const voiceNameVars = {};
// ele(ment),conf(ig)
const ele = {};
config_ids.concat(other_ids).forEach(function (id) { ele[id] = document.getElementById(id); });
const conf = {};
config_ids.forEach(function (id) { conf[id] = ''; });
// preset config variables
conf['restUrl'] = 'https://example.com/api/';
conf['sttLanguage'] = 'en-US';
conf['sttHotwords'] = "hello;";
conf['sttAnswers'] = "what's up;";
conf['sttConfirms'] = "You said;";
conf['sttNoWords'] = "No;stop;cancel;";
conf['ttsVoice1'] = 'en';
conf['ttsVolume'] = '1';
conf['ttsRate'] = '1';
conf['sttTimeout'] = '5';
conf['gptApiKey'] = ''
conf['gptSystemRole'] = 'If the generated sentence contains more than one language, using language codes like [zh], [jp], and [en]. For example: [zh]中文的“你好”用日文应该是[jp]“こんにちは”，[zh]请跟我读一次。Include only [zh], [jp], and [en] language codes.';
conf['gptTokenLimit'] = '100';
console.log(ele);
console.log(conf);

const msgHistory = []; 

// config show/hide button
ele['configButton'].addEventListener("click", function () {
    if (ele['configContent'].style.display == 'none') {
        ele['configContent'].style.display = ''
    } else {
        ele['configContent'].style.display = 'none'
    }
});

// config content button
ele['commitButton'].addEventListener('click', function () { pageToConfig(); });

ele['resetButton'].addEventListener('click', function () { pageToConfig(true); });

ele['exportButton'].addEventListener('click', function () {
    pageToConfig();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(conf));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "browser-bot-config.json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

ele['importButton'].addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const importedConfig = JSON.parse(e.target.result);
            Object.assign(conf, importedConfig);
            configToPage();
        };
        reader.readAsText(file);
    });
    fileInput.click();
});


// stt button
ele['listenHotwordButton'].addEventListener("click", function () { stop_all = false; listenHotwordMain() });
ele['listenCommandButton'].addEventListener("click", function () { stop_all = false; listenCommandMain() });
ele['stopButton'].addEventListener("click", stopButtonMain);
ele['sendButton'].addEventListener("click",  sendCommandMain);

// tts button
ele['speakButton'].addEventListener("click", function () {
    ttsSpeak(ele['ttsInput'].value);
});


// log button
ele['cleanButton'].addEventListener('click', function () {
    ele['logOutput'].value = '';
});

ele['saveButton'].addEventListener('click', function () {
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(ele['logOutput'].value);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "browser-bot-log.txt");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});


//  conf var to ele var
function configToPage(reset = false) {
    config_ids.forEach(function (id) { ele[id].value = reset == true ? '' : conf[id]; });
    // setup voice var, like voiceNameVars['en'] = 'Google US English'
    voiceNameVars[conf['ttsVoice1'].toLowerCase()] = conf['ttsVoice1Select']
    voiceNameVars[conf['ttsVoice2'].toLowerCase()] = conf['ttsVoice2Select']
    voiceNameVars[conf['ttsVoice3'].toLowerCase()] = conf['ttsVoice3Select']
    voiceNameVars[conf['ttsVoice4'].toLowerCase()] = conf['ttsVoice4Select']
}

// PAGE var to conf var
function pageToConfig(reset = false) {
    config_ids.forEach(function (id) { conf[id] = reset == true ? '' : ele[id].value; });
    if (reset == true) {
        configToPage(reset);
    }
    // 将 conf 保存到 localStorage
    localStorage.setItem('config', JSON.stringify(conf));
    // setup voice var
    voiceNameVars[conf['ttsVoice1'].toLowerCase()] = conf['ttsVoice1Select']
    voiceNameVars[conf['ttsVoice2'].toLowerCase()] = conf['ttsVoice2Select']
    voiceNameVars[conf['ttsVoice3'].toLowerCase()] = conf['ttsVoice3Select']
    voiceNameVars[conf['ttsVoice4'].toLowerCase()] = conf['ttsVoice4Select']
}


// 初始化語音選項
function populateVoiceList() {
    // stt language options
    let sttLanguageOptions = [
        { value: 'en-GB', text: '[en-GB]English (United Kingdom)' },
        { value: 'en-US', text: '[en-US]English (United States)' },
        { value: 'ja-JP', text: '[ja-JP]Japanese (Japan)' },
        { value: 'cmn-Hans-CN', text: '[cmn-Hans-CN]Google Chinese (Mandarin, Simplified)' },
        { value: 'zh-CN', text: '[zh-CN]MS Chinese (Mandarin, Simplified)' },
        { value: 'yue-CN', text: '[yue-CN]MS Chinese (Cantonese, Simplified)' },
        { value: 'cmn-Hant-TW', text: '[cmn-Hant-TW]Google Chinese (Taiwanese Mandarin, Traditional)' },
        { value: 'zh-TW', text: '[zh-TW]MS Chinese (Taiwanese Mandarin, Traditional)' },
        { value: 'yue-Hant-HK', text: '[yue-Hant-HK]Google Chinese (Cantonese, Traditional)' },
        { value: 'zh-HK', text: '[zh-HK]MS Chinese (Cantonese, Traditional)' },
    ];
    sttLanguageOptions.forEach(function (option) {
        const langOption = document.createElement('option');
        langOption.value = option.value;
        langOption.textContent = option.text;
        ele['sttLanguage'].appendChild(langOption);
    });

    // tts language options
    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
        voices.forEach(voice => {
            const voiceOption = document.createElement('option');
            voiceOption.value = `[${voice.lang}]:${voice.name}`;
            voiceOption.textContent = `[${voice.lang}]:${voice.name}`;
            ele['ttsVoice1Select'].appendChild(voiceOption.cloneNode(true));
            ele['ttsVoice2Select'].appendChild(voiceOption.cloneNode(true));
            ele['ttsVoice3Select'].appendChild(voiceOption.cloneNode(true));
            ele['ttsVoice4Select'].appendChild(voiceOption.cloneNode(true));
        });
        configToPage();
    }
};


function ttsSpeak(text) {
    return new Promise((resolve) => {
        console.log('ttsSpeak:', text);
        if (text == '') {
            resolve(false);

        }
        // Preprocess the text
        let re = /\[\w{2}\]/g;
        if (!text.startsWith("[") || !re.test(text)) {
            text = "[" + conf['ttsVoice1'].toLowerCase() + "]" + text;
        }

        // Split the text into an array of language codes and sentences
        let text_list = [];
        let split_text = text.split(re);
        let matches = text.match(re);
        for (let i = 0; i < matches.length; i++) {
            text_list.push([matches[i].slice(1, -1), split_text[i + 1]]);
        }

        // Setup timer
        let myTimeout;
        function myTimer() {
            console.log("myTimer activated");
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
            myTimeout = setTimeout(myTimer, 5000);
        }

        window.speechSynthesis.cancel();
        myTimeout = setTimeout(myTimer, 5000);

        let index = 0;
        let voices = speechSynthesis.getVoices();
        let utterThis = new SpeechSynthesisUtterance();
        utterThis.volume = parseFloat(conf['ttsVolume']);
        utterThis.rate = parseFloat(conf['ttsRate']);
        utterThis.pitch = parseFloat(conf['ttsPitch']);

        function speakSentence() {
            if (index < text_list.length) {
                let lang_code = text_list[index][0];
                let sentence = text_list[index][1];
                let voiceName = voiceNameVars[lang_code];
                let voiceLang = voices.filter(function (voice) {
                    return `[${voice.lang}]:${voice.name}` == voiceName;
                })[0];

                utterThis.voice = voiceLang;
                utterThis.text = sentence;
                utterThis.onend = function () {
                    clearTimeout(myTimeout);
                    index++;
                    myTimeout = setTimeout(myTimer, 5000);
                    speakSentence();
                };

                speechSynthesis.speak(utterThis);
            } else {
                clearTimeout(myTimeout)
                resolve(true);
            }
        }

        speakSentence();
    });
}



//https://stackoverflow.com/questions/41373579/the-effect-of-the-grammar-in-the-web-speech-api
function detectKeywords(phrases, results) {
    if (phrases.includes(';')) {
        phrases = phrases.split(";")
            .map(keyword => keyword.trim())
            .filter(keyword => keyword !== "");
    } else {
        phrases = [phrases.trim()];
    }
    let pattern = new RegExp(phrases.map(p => p.toLowerCase()).join("|"), "i");
    // Check if results is a string or an array
    if (typeof results === 'string') {
        if (pattern.test(results)) {
            console.log(`transcript: ${results}, pattern: ${pattern}`);
            console.log(`Got keywords`);
            return results;
        }
    } else {
        // Loop through the alternatives to check if any of our hot phrases are contained in them.
        for (let idx in results) {
            let transcript = results[idx].transcript;
            if (pattern.test(transcript)) {
                console.log(`transcript: ${transcript}, pattern: ${pattern}`);
                console.log(`Got keywords`);
                return transcript; // Return them if they are
            }
        }
    }
    return false; // Otherwise return the highest confidence
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
let command_vr;
let keyword_vr;
let stop_all = false;
let stop_listen_keyword = false;
let stop_listen_command = false;
let final_command = '';
let timeoutId;

function sttSwitch(act, vr) {
    if (stop_all) {
        stop_listen_keyword = stop_listen_command = true;
    } else {
        const shouldStop = act === 'off';
        if (vr === 'command') {
            stop_listen_command = shouldStop;
        } else if (vr === 'keyword') {
            stop_listen_keyword = shouldStop;
        }
    }
}

function listenKeywords(keywords, one_time = false) {
    return new Promise((resolve, reject) => {
        keyword_vr = new SpeechRecognition();
        keyword_vr.continuous = false;
        keyword_vr.lang = conf['sttLanguage'];
        keyword_vr.interimResults = true;
        keyword_vr.alternatives = true;
        keyword_vr.maxAlternatives = 10;

        console.log('keyword_vr keywords:', keywords)

        function restartKeywordRecognition(has_keyword) {
            console.log('stop_listen_keyword: ', stop_listen_keyword)
            if (!stop_listen_keyword && !stop_all) {
                setTimeout(() => {
                    try {
                        keyword_vr.start();
                    } catch (error) {
                        error;
                    }
                }, 100);
                if (one_time) {
                    sttSwitch('off', 'keyword');
                }
            } else {
                keyword_vr.stop();
                resolve(has_keyword);
            }
        }

        keyword_vr.onsoundstart = function () {
            console.log('keyword_vr onsoundstart')
            ele['sttStatus'].innerHTML = "listening for hotwords";
        };

        keyword_vr.onend = function () {
            console.log('keyword_vr onend: ', stop_listen_keyword);
            if (!stop_listen_keyword && !stop_all) {
                restartKeywordRecognition(false);
            } else {
                keyword_vr.stop();
                ele['sttStatus'].innerHTML = "stopped";
                resolve(false);
            }
        };

        keyword_vr.onerror = (event) => {
            console.log(`keyword_vr error: ${event.error}`);
        };

        keyword_vr.onspeechend = () => {
            console.log('keyword_vr onspeechend');
        };

        keyword_vr.onresult = (event) => {
            console.log('keyword_vr onresult');
            let results = event.results[0]
            console.log(results);
            if (results.isFinal) {
                has_keyword = detectKeywords(keywords, results);
                if (has_keyword) {
                    console.log('keyword_vr Got hotwords');
                    ele['sttOutput'].innerHTML = `[Got hotwords]:${results[0].transcript}`;
                    sttSwitch('off', 'keyword');
                    restartKeywordRecognition(true);
                } else {
                    ele['sttOutput'].innerHTML = `[Detecting hotwords]:${results[0].transcript}\n` + ele['sttOutput'].innerHTML;
                    restartKeywordRecognition(false);
                }
            } else if (results[0].transcript != "") {
                ele['sttOutput'].innerHTML = `[Detecting hotwords]:${results[0].transcript}\n` + ele['sttOutput'].innerHTML;
            }
        };
        restartKeywordRecognition(false);
    })
}

function listenCommand() {
    return new Promise((resolve, reject) => {
        try {
            delete command_vr;
        } catch (error) {
            error;
        }
        command_vr = new SpeechRecognition();
        command_vr.continuous = false;
        command_vr.lang = conf['sttLanguage'];
        command_vr.interimResults = true;
        let isSpeechEnd = false;
        let isCanceled = false;
        let output = '';
        let prevInnerHTML = '';


        function restartCommandRecognition() {
            if (!stop_listen_command && !isSpeechEnd && !stop_all) {
                setTimeout(() => { command_vr.start(); }, 100);
            } else if (isSpeechEnd) {
                sttSwitch('off', 'command');
                command_vr.stop();
                if (isCanceled) {
                    resolve(false);
                } else{
                ele['sttStatus'].innerHTML = 'final_command: ' + final_command;
                    resolve(final_command);
                }
            }
        }

        command_vr.onsoundstart = function () {
            ele['sttStatus'].innerHTML = 'onsoundstart';
            console.log('command_vr onsoundstart');
            isSpeechEnd = true;
            ele['sttStatus'].innerHTML = "listening for command";
        };

        command_vr.onend = function () {
            ele['sttStatus'].innerHTML = 'onend';
            console.log('command_vr onend');
            if (!stop_listen_command) {
                restartCommandRecognition();
            }
            ele['sttStatus'].innerHTML = `Wait ${conf['sttTimeout']} second for commit`;
            prevInnerHTML = ele['sttOutput'].innerHTML;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (prevInnerHTML === ele['sttOutput'].innerHTML) {
                    isSpeechEnd = true;
                    restartCommandRecognition();
                }
            }, parseFloat(conf['sttTimeout']) * 1000);

        };

        command_vr.onerror = (event) => {
            console.log('command_vr onerror');
            if (event.error == 'no-speech') {
                isSpeechEnd = true;
            }
            restartCommandRecognition();
        };

        command_vr.onspeechend = () => {
            ele['sttStatus'].innerHTML = 'onspeechend';
            console.log('command_vr onspeechend');
        };

        command_vr.onresult = (event) => {
            ele['sttStatus'].innerHTML = 'onresult';
            console.log('command_vr onresult');
            let results = event.results[0]
            console.log(results);
            if (results.isFinal) {
                isSpeechEnd = false;
                final_command = final_command + " " + results[0].transcript;
                output = '';

                ele['sttOutput'].innerHTML = `[Command]: ${final_command}`;
            } else if (results[0].transcript != "") {
                output = output + ` / ${results[0].transcript} `;
                if (detectKeywords(conf['sttNoWords'], output)){
                    isSpeechEnd = true;
                    isCanceled = true;
                    ele['sttOutput'].innerHTML = `[Canceled]: ${final_command} (${output})`
                    restartCommandRecognition();
                } else {
                    isSpeechEnd = false;
                    ele['sttOutput'].innerHTML = `[Command]: ${final_command} (${output})`
                }
                clearTimeout(timeoutId);
            }
        };

        restartCommandRecognition();
    })
}

function getWord(words) {
    if (words.includes(";")) {
        let wordArray = words.split(";").filter(function (word) {
            return word !== "";
        });
        let randomIndex = Math.floor(Math.random() * wordArray.length);
        return wordArray[randomIndex];
    } else if (words.length == 0) {
        return false;
    } else {
        return words;
    }
}

function beep() {
    setTimeout(function () {
        let snd = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//vkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAMAAAwwAAnJycnJycnJzs7Ozs7Ozs7Tk5OTk5OTk5iYmJiYmJiYmJ2dnZ2dnZ2domJiYmJiYmJnZ2dnZ2dnZ2dsbGxsbGxsbHExMTExMTExNjY2NjY2NjY2Ozs7Ozs7Ozs//////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAMAAAAAAAAAMMCW6R6rAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vkZAAP8AAAaQAAAAgAAA0gAAABAAABpBQAACAAADSCgAAETEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWenDBMAGIxJ4qyMLEDcDGzRFqX3jM+B1Qwx0LxOVLytTQBiQ7PAwjcDbMCKAdjCrxMQwYQBd/zIEZTFMXTT+5T0ksP/zFsJRoeDCcFz+rjDnYjzOkMv/0qC6itJCBpicVpkmq3//+rtNwBAQ9iJx0Y1xjAEpo6q5lmIpgEQn///40Bha8WCBCtYgsBZAXpgOFBu4VhjEahmAHhhyI/////iEFTCcCwMA6Ra1wMAgAAwwwXo6ifw3PKEygHgw5DsyLJMx7FX/////AwSBAfGEADAIBxIBS3xgsAgOEgyNKs6/BkzWEUCgwY5FwZFK+eHxOdFER//////4cAZcQiCMv6YLgKAgbRPQrMAwNAQBFY3mCAPhURAQYhvEwxuCW5h4MRhAFAXG4xSKn////////zBgBCIB06H/BwSP8XwMPQJSAAQJoYhcFDDIEjg1lzdU7zIcozI0KzHAHwgDDH8iT8FuzK80zGUDDMMWTB9DzpmG//////////////////////0K30op5/LA0BCx4YgZR0MANdE53GtFP/////////zRwpjEMXxkCASDxgUEZiaD5zczRoIQwUA1WAwaJg0iM4z+L4xsAoFAWgnMAwZMPwdQwUAQogAAAAAMBAAQwsCeGB5AlZguoUAYNeDQGDeDCJhkwOsYM2CQmb6F95hngW//vkZP+ADn6InwZ/oAAAAA0gwAAAOuYDAzn+AAAAADSDAAAAqa8GrVGH4i7BgEoBgYCQANGAIgtpECCGB9gBRgOwFmYIATFTHafNXDAwPmwepVLzEAKaSVgEzcVx4BiQFOCpwxaKm/MQApKUx8SjAw9MSC0x2sjLY7MMAFJMw2JTE4VVeYJAYkBAYGzBZCTFLqBiVMUDoBXQyOSjCBML/pJqXumweGiINJ3DICIA2OgwCgQkDRiILGIAsBicBlaYQB7qRtewAASXEJLnggOmGQIQhIWHYABYQIgMLQgvmeDyYcDRkswmDxWYYIphYiF+16Q3fbdkDJC1hKFBIAAojKymBAAYXAo4AAYCTGxAMUi4LCcwoKxGUjHotMHA8yCI3yi6Kb30jvISGaF60ZEBrdZCWuLcIyAIDhwAaYYHAjxmDAKYYDhhgFhUPBQEGNxy3IxAKguOS9EOv8wQFAR+YuydlECMXTkXoYEE5dUCh4VB4AAbGQQDggDGEQsHCAwyFC2IIB5mUEmDQMNFESV5k8HjIBMLCwxgDTFxLMXkwycMTD4XMLhPPP////////////////////3dtf///////////////////+pVODBIQQEZAQCIJKMD8ALjAkwWsYB8jAs03E7JgVYMPaFCzCzQggwXgQSMEuAfDAigE8wEQK/MQKB6DAWwHcwHYA0MB/ACzKgfMkD8zkzT7CyMngMCgsKgcwcV0ExlAVmnEAZyBKghgwCgEOioTFjwcBQpg8LGLBA2MwSUzEwfGgGYbD5kwFlkjBgEMMhIBAoyUJjFoXMFhQxWBx4ECwZMKCBY5g8ggI5AEaDRXUuBovBwhMnmMwkLjEIlMLBQwoBUezBIsEB/MgihXA0DjD4PMYAYxwFjKBABCIMNDIwEGSg0GIQCZGEiqpgsJmHyUBQ2YNBJisfmKweLGMxGMAUXRkJu8IQAKBYw4EjAwYMshUwSDCshhYzLuMXmuXEIkC4wBxSMMAgIGCRRhIAioABguIQ4YXEoYBAMXQuCTAYgT4FQ6YQApgEEhYEumBgeLDomLAWGQKIDAhwDFtTCQEMKAwACMcFRh4SCQlMBgQwiLzAQFWKYsDZi8WmCwkYMA5hgAmMSCYIB4QBTBIjIkcAkuLB0xMNjCovMFgYEgVKRcpkcIiILr6YyYlDpEFm+MRC4yEGTHIfKEkIhcBieDgOIQoYOCZhICgIbgAKmLwqYBBxhARkQ0MiCUyGA1gHElvDA2AiwwiMF3MCLA+TAcAF4wqIDqMEj//vkZPoP/u5gwId/gAAAAA0g4AABOpWFAA/7Z0AAADSAAAAEAZzDFjLM9sgOVMmQ2MzWhpTUNbuN0Yzo2LWOTG6YQOnxDU2WwcjUYLUMtcnsxPxUzCWA2MLMFgySAKjBBChMHMKAwnAcjH8U4kFOxfTik4/KkNxjzRzo6oTNjaQA1nrtxkCsa8umkrZn04bQirmNBcws/Cw6RQJjqmBAALGIhZDNAIWBjLCAw1Aa0MGQtdAELMhGwaTmmhplh4ZsIFtDCzkx02MSLjERMmJg5GJEEx9LOCHQdlM7M1IjUGAxdINncjShYyosNzFDCD8xktMdpGNDwKYknmVgRogkDpwxoIMcNAIIlujCAkzUPNcDlbTTygLIwMDA6sMXGywlGzAoBLB6EFUAwFFNHRzO0kFAZjgqZ2JmLkxi4YcEaCgSbOUBhkIhQHJhmoIZcDAJIDqsGFgKEhoIL5mslgOA1igIaT7MuDjEzMwQEAp2CgwIITGWQ0pKFkQygORPMUEAMXGHjpIbmJoYKXDRz8QmY0MGgC5opEZWImjFgWBzAghDczgFMbIh58Bg2ZiGmPlRgQMAB4DKRjYAAlkRjBkogbiPGNFxgw4hxMCLDIwYEnJj4+Aig0ANZSAgEAE4NAYrNWe1EAMIgDAGwV4wEEBWCwEaYEQBTGBigLpgbgJmYEGDgGZ1B6ZijQOsYaQLSmHDkZRgdInWY7cDimKkryxxQSGYZ6+IWmQoBy5gBoSQZkdpMyjp6APJBYwiETCIsM6oE5EdTYMaKswNLMA3KSTbAzNfqAx8szFgeIp0bMVBFsjJglMAEgwyFTFwLMXrY6EujN45NKEjCQ0HMhgJEYKznex5ggQYEgDVCYsJFYwFiU2+DLLCRcpkYQGmPhBhCKeExDIOPCI8vGQApl4eYidgEMMFLTKBAwokAyIFigxpbOPgw4uMSKDThAOCjDD4aNQELGeJgCCzBgQyEZMiIDFDYwILMvEBY1S+MiIBwBEmM0pgDMIzogCg8Y8DCoQZUFGBrJucKc6+m5CCgYMCgYMGsORrxsDiUyUrFQAwwIMeHjC0c2cvEhowQKIAoEkIqEGRk48bjxGs4wETCAh2FzmLhJhQ0tAODIu1RM5AQsCodB7VIZDgZLYkBG9aEwZGsHCSQAkGA4bgJeyaQ6Aw4gPWgCQNHYlBlsiwQneIwVOsKBDJFXo3McS/X2kAOgA8KQSjS+D8spqwxazMABAHDA0AF0DBNRgCoAWYDMAKmA7gJZgeA0EaQQBqGCAAjJgqAN6Y//vkZO6B/apgRMP828AAAA0gAAABPLGBDA/3jQAAADSAAAAEECFkmDPAmRgbAeGYXfEjHH5JwJ79/xjK+5pWP5g0OwQDhl4SBtURBgiBZgYHBhiA6PhhsHBguWRuKV5kGRximFBh+C5gWBpiOE5Qkh4k05hYGgYYgYCmHCYCiWAHwctPoJCQYchEAjDgyC4GMan8w2ZhIkmARYZtChio6jUoBx1M+tgwaHmMlrg4GmIReZHMprdMmBg6YaERhIFGERQZJCphEZmgGGKjMwoDjFJzGU2YUMhjYMHpiEBSILLwzMWgyEGEgYDhsY2IIWIQJBgNRJiwNGQiUYpNwEMA0cTHpBMCk4ycSzQJQMJpIxwTDLRyONnIeRpksWmlQeZxZRndnGGyKZMV5iNDmqzUbMLBo4/GoZ0PO4z4DTY7MMTic1aGTIQdMQhoQnsBJYxaVTJI7M2DwwERgcdTFYOMdDAQBhZpg8LmAgOsswEIy54VAg8IUS1+gQGmFgIoITAkeE5QAjEQlMJAkwKFAQByEHmCgcleJBkwqAhIDDINAQPMCA0ZBgkFliloisCGCgQ7wOBrEAKCl4BgbJAWBgMGD1IRYoEAICB5hcBAIFgYQqWJgMVYOVQWgKRPX84ti3///601pIA4CDUwMEMwvBEx7CIxNJUwYg3CNMGC8zAyAGUwOcASMMVDxjCAgbswa8MRMEYwHjNLyLUwzcJSMD4CjDAigFI2YszAxaMDeQ1VQTDpWMCFswcbTPQXM9BUxorzfLOMFkIx60gNGjKI2AoANNPw+XI01whJmHAKCSKaHAxhsnnuU4Z0EYsKA4rGFgAYrJBCpTRQIEhAJEgyIKAoDzEJpKBObmJYANZksLGCw+FAsFi6ZKDhkg3GPxGFjEBjgaNDBn0nmOxCYnASEwwGGDQLDEREN8Bs0MBzubdM5iAyEBDO48MwGUzYFDExdMmmIwyITItjMSls2Y4DKgpBw1NILoeFQGTJlg0mAAmanUZgsIGHCCZuFZq6VAZYmaR6aZCRmA9mP1mZDGxthRmGjCaSXhqRym3AMYxB5q82GyQoIDAZOURxJ9GbTWcYRhx8mGeEmYiJwoAjKxvMBg4QDAAAQ0YMjJ4TMmj8qh5LUCAkxCDDEQcbCYCAIKJJMCholGGQwARGk0YeEgWF5gQRwgdFgcRy6BiEMpXmHQkYKCCAAcBTiBYOgENGFBQlyY5A5UCQCOityfQOEI0IgYGDCwlMNBcwUGQoBgcLUQFMjEgBMJgoMFYsNAwdgEINMCwK//vkZO8P/21gQgO/4UAAAA0gAAABOH2BDA/zbsAAADSAAAAEIQmYZADzmDQJfjFh////WYHgBVGAhAGBgN4DgYEMAAGAqgSxgGgBaYEuY1GTGA4pgRYHKYAkC6GA8AxxhHYJGYQYDJmMstYhuKYOyYeCANmD4AnJgUoE0MFUwOPDFkGP0lczePDAg/MPBYgFZhoymVDOcEEQCB4chh4bAomOeZJKh3lXGlBoCcQaNiEHMSKR1xOGMTfBEBJIGFk2THjwiADMCweOxo7MIFzGSwx0pAwIcKGmDArDgoCIfmAkBgoWZjMl6AIzmbCZjRMMhhkg4ZISCEEYeSgZl76cYwigkdzcGGCoAaDGD1mwc4BxUDjECBBnzmbWLmKyByIIYzVHCqZkawauDgwDM+nTPzAGGB0dsaS6lQ1M5GzV2c4SRM4NzRo4+f4NqMwgJNmVTk1wyttJTIw+5P6ljK2k7EGOslTFFkx4xNbQjVRQBSpoZkamNGAjYIcTWjA00PMRGjMQ0EgBgg2JAphwYmKFCEwMIAgUGIxdUUAmcluh4mTEBAsgSREWcIQIxcFAxaYWBAosQULAov4iIjCSIEgZkwqDAsxEKMDCWsInGFjI0CpKES0HEQFEjAQ5IBuxKIqGIglA2VAow4MWiX/KBJfpCGgYFKAaJznFMF2B0jAmAEYwG0AaMDjAvjAiwQIwJwCtMGXT7jH3grswaMBUMFlBGDCKQxEeBmzA9QdIxsdHCPiFCfjD6QMcwPABKMBpA+TAXQFUwEQBwMAzAaTCuwHowDUBXGgDwwHQBeMOmwSTxgtpEpvMrBsyaSzCZiMkEEOGRgUrmtGIYdDhkwZmUjWYOFQFCgJAxxximMB0ZHAaBZg0ZmEQYMC4yKTjH5QEIJAQIHA0kMCCIYxShhcIgYqgkMmEweYnCiLJicfGSheXCBQkBwXBQKECeMCk0wwQAEPzBhUMOj4w+PACnjAyXMwIgxkKjAZoMziQaMxjEhmcwEQkUweNjFoYBiDMYnIxSCTDgQMNA8zgGzFwMMaIc1YgRpgAwBGMB6Z6F5mUFEwJDDgYXHBkkvGzTINBARE4zSmDSLCNBg8y0UzJyhObEcyglNkERJjMmgzI0c2hXNuBDESxNowEHKikZELGyIsrMTFwoHqqpMmCkJjJ8ksCA0xwDMTFI+YgRGFjw8WkocFC4UHgwPUGMCOg4GMTARqYMcGRgIFEgWYzEwEyoOMUJwgMBTMTKgyGmglBgROZyPv8YYdEzUx8wEeMQEg44iBgBOY+//vkZOQP/z1gwQP83PAAAA0gAAABO7GDAA/3bsAAADSAAAAEBGMgJggsZSXI6DwMXdbIBRAxoVGo9ipgIuVjLTm1ndGDmhopgMoDCYEmANmBIAnpYAsDAfQWEwN9cQMULCIzBOwXcwMAEdMHiAqDCiQNkw/YD2MjNUpT0wSSwxJUKjMHkBODBCAcMzBLEyuMAyFK8y1AEHGsLAiYmiaYPgyNCkYrhkbKh4YUAaLBCY+B+YGhKYEhmYbBOcBGSZ86GWgBgwmZsamKh5jzEfCEgKqNKVDICIyohNhHjUVszIBQCgR2N9EgMJGQEIOBCU/MQDTDwcKFbEDPkYWaDQiUmvDOC0CjhjQ+FgsFDxsecBmcgDDFCgzJYMwPjlyQ/slODOzpAQIXASYmSB5kK6bMRmfLRhoWGRpggCiEXdNMKgSVmWBhImHeKZkQ2cMUmEk5tIOJHggWwCJgZ8NzBzIGg0MOOgDDQBUwlbOMiDJWo0BWERoaSeEjUxY1NaYYY6ImEKJhiYZmQhAMZUOGeCwJGgQLBo0ZoOGnF44Cp6Dx8HCQYVGCBZlZ+PE5qhyYkDmZBZuC2YaZgwSMVUAaCAQIBpsa2ZmhtAKcjDhkyYMMMSjMigwwCDCEGhRgJiBkMzwbCooiGZacGHHhhQWY4VmKH5hqKY4amBhQGXzKQMxIaEAePPplImTQJjoGz4eOAwOBqCYGamABBqwiZGDwA0xXN+8qQAABgIoGOYEGBAmAHAOxhJgCMYEmAzAAD9MCVSLjKxwV8wCYA4MGHAfDARAM4wCoG7MMQA5DAlZec24EpcMQ1CFzA0AGkwDwEbM7jUyYLjAbtMdC8JDIcRwMMTHaLChWM/C49oHjLA/IBAY2GANFBIAzBxkNwpMyaDjDpoMWgczSOjFZDMln85SBDJJnMyFjNx8KmRkJmZ+vixuYQRhowIyoBCkNmxmZWBjwuNAxhzSYaEobg4nGzJYUDBYEVghLMIJTASgzYdMaEFGiYVMeCQU9GEmwGVjJZMzYhIQwwoFMFFDWgI0EjJAcwYGKgOaAXGMFwCGhZVRnMDAAYFGvE5iJ6ZeQCiAZcSigeJMhhZQZ6SkCwYWAmIAZi4OGIJjzWYIFGZABsLMasHGIN5iysBlQICQU0lQwNREjRA4rKAgalpMnmXCpg4eCnQyVXDHIGCQBISqLgIJMLMSYKJBcOUDRFIv+IxwaPjDDJcwOPjHQQyoCEiMQACZhQCmXJJtw2YyLGBtZVLgoGgJNMjNDFhAwEEMfJDOwIedDNAYz//vkZM8H/r5hQCv828QAAA0gAAABPHWC/A/zbwAAADSAAAAEgjNKLAcbmGixsIeTPBtsSYQFGSAoEFDCwIxMWMbCWYAlAMgMjDhQxVHM1ESqAhQNCwHKUNU9Q4HvdMB7BKTAKwYswYICPME9AMDAOAVADASpgq6QAaZWAjmA/gt5gvoP2YDqCCGBHgz5gtYRwYT1bjmweHCxgegdeYBCDBGA3Ab5jMjmUhEZPFZ4wumi0kYECBlQ2GcRuZYOxvrYHG2y/BiAAjUaM/GgxoODDwjHTQZsHJg83BAXMyFcHMwy9CT8mQMuCU1gJN2by6aK5oASQF5n7GKGoGYyQYNjGTNBY1FpCF8CjJjEGXcMBLzDzIsRRlIkYCRgQdMbODMCAQjBlyyY2KmEHZjhcaoJHGgoweHKKp1CSZukGYB5p42YiKmBC5nysYUKmZPxm4qa3WGSChqQyEYxoqklMYuRnPG5KrDQ2ZGdlVOM+TDeVwwowMWADOoMzs8MNTjk1AyQOMgAjCAwwsvSFN7GzXFgIlRphHhYwdLMjQjeTs3EIBq0JEBUHDDkcy9BGoUMFDACA0lUMoHDaSszRLAwuHIKThhjGao1GaLpkS8YIdBmgikaoKCokZmImPwIJZzaBQzgUMiLzKyEw1QMBORG0gEaMTATKw4MGjbT8wkDMdEiVcBpOIE0rHWDGfGgIUzQAg0N4MdPCEMEZEaG0mUnwMbTSFI0U/M3RTHi4wQ1ABGCtcz0VMhpFExCKyIcBACM2v///ZUwG0QXMF6AnDA3QNYwEQBAGgKQwKUBOMHNKoDQvwewwP4K5GgaIwTIHjMEgApTAsQKQxJ5vbOlWDWDEAAMEwVUD2MDgAOigcAYPmBjAZ0HhuAIjgAMIo0yOzDLgaMoh48qZDJJQGAmYdHZjgmGRwoY/LhjkOGlykZNFhMHzQIFMjm8eOB55jmOA+Y8XixuZCYm+gJq8QZeCmYBACizKigxkEMSIQaAG9sRhpcYKWmVh4KIwxQMEITEmk1w4M+BTFC85pjLshZMMSjCqQCxqFQA1MjPKFgMjmJL5gY+b+rmGqJmzUZmahYbMdWDQCEy18MPAyVWEYqZcGGQgg8ulAgZCOGGjpg5GYcgGjkRgR6QFZwrKaAVGSkwkWKzmEiACfxaUJjwyYJMJpTQiAzEgOojwosCyAZeTIwk0+AWcycmKpIAmEHII6GgpeMVITOyUzoLMdQTIDY1ozAz8DhUmOwaEkQqYiDGLn4kDslM+FDHxQwJKNkRzATwRKZgwKYo//vkZL8H/sdhP4P828AAAA0gAAABO9WC/w/zU8gAADSAAAAENmuh5rp+LEJUqTKAUwZLMUAzeJQ24aID4KACg0dLCaHP5rpCNmIBCzDw5KdE4yRJMUGhJaNOCRYiFBYyoaAQOJWwjJCwEmLgjPCUhMBHzIEw0YGSSTkXY6cjsDAGB2hBZgJQH2YFgCnmDcAJpg/QESYDUCWGC/jMRnbYFoYHUBFGBzgfJgXgWKYCgB2GEbgqZiKBBqcqoHbmF3ALRgm4CEYGAAPGBMAJgKA9zAHABAwGkA6GgFcwEkAZMC/ARjEQWMeh0yDFTj6uMDAUDAAxOISQHGWxMJNoy2HBKEgkQmNQ2ZqGBl0DgomnHwMYDDo0LiYrL9MoAgIRBn4ImFQuSgEykRBQgmPhcGFcQGkwGJTGw8MFi5AeYMHAjG4UKxhgFqbmFB4ZhGQsFDEJSMsj8wYajEAWYUYSMphgaGSgWkOCAMLgIxUOzAZWFlEYOBRhsdihOMRigw8DjEoiNHjMwOFBUIGPBQRBQw8TzKQZM3A8RhweB4sLTAw2MrGEwcQjBg1RuCDAJBMRi0UK5gcfGCBCZUL4sDzAIoNLhIxIIyZ0z58xgIQRAoJL8gYqZWEYQAZaGDRhnUYDInASq3hjw0YRIQeWE00WaGAJgw46QGOnhEgQ0g8byabVOQItHLMkpkLUAE4P0pOM+BoEzTk1j4yrA0iQWPjRwzAhEwqyDY5DH3zqiDXIxANOeKMqPBhQdCGOBkJIwzo3z83YE04kAliqhCQwteBiwwCQ2As2jkas2EdRYMZoROpVMLODTDCxQJYwOMDiMFWAuzBUAJowL8BAMC5CVjM6wmIwYkCjMCLBjzA/AiswVIB6MC8DQTGHD4g3qwahNB3o0qNTLhiMul40SZzGSpN+iMx+bwiFGDEMZXChlxumF3md8IxjMZGVTQDhWYbD4AHJjgFnWxCYEUGFnZjCMZURmepBnZKeiPGhhoMXBpKGDExWVMcWjYCE0QhNABQIKGhKoOyDGw4KM4FXhbdMLKjJlcy8kMKNAyxMIhBRNCygInMydaNmiRFOAZjNtTwUwhD+UEJndQa47nw3hqDsasMA4mHDk0ovMrKjbQ8dLRU3W2YgeGZCKihoasAAAwFTNdJgMJGUmZnwGYESmHnYBDTPIQxIYMAbTET8wJOMhcjGS4EQw0FlSHMNYjPUQLmhgYUhScCZFmxq1NPhQaEmHi5naYi6QEQYXBgqhYAU0wQZNQZzQwoxQ3AAyauPEJMGWZrCiPLB//vkZLEP/tRhPwP820AAAA0gAAABPUmG/A/3bMAAADSAAAAEiZAbQKmlq5phAKgBs5EYqSA4AARGECZrJWY8RGMNZtBMZcDNuZsPmwLphQeawKA6lObLzJ08xwWAT8AVwxEQC5OkEZaYGXjZrI4bCfwgYITBTsw0MMgNjNkICvxs5QISADBpohyYuFmbhxgKGCqxHFcJhIoYwSzlUwq0FOMHJAmzAVQGEwOUCJMDuBHTAhwLYwbcDaMl1BjjA5wFQwJUA7MFPC2TBHwVgwe4KXMHdWYjHrBm80vp40iLszKHQzrKIwVG8x4NkzfAQwwH8xoBww7DAxtB0xkCwwfIc0+KMhBMwiUN0LzTBgyMwOIRT1UwWajGhI0MGOFEzUjwwxtAgAYMxGQHRi4IasCmTFAFZAhwKLgzgpM1hRAoGXCZlIUGNpqJ0SFphquYcMGeEoBQwoaHBCJjSGYCUGQIpuBkbWSnYJRjCQJGpgKWAl4ZIDC1oyQzM8ij+JAywVg4w0aNTZzBSg0k6Gl0xI1NGBTOCwyYKM2QTFA4xQ6NxFxCRmaH5m9KUGpjqgawQgQsNdDRUiMYMTBmAycxBowZUgiFYNOEDEEEOuTUCo3RjMkHgK7mFlZnwUakGqUmNlhRhEoEYifmhqYhBwQfmILxhweaCLmcqxgR0Y+OGIIRhgQAgIwwSMvDTXzsxhMM/GjJmMwRjAkIa2rAY8MPDwUDHGFJlJYLMBqgoYagBYXM2CTbUI1FeMFLzMwcEpJlSUa0ahi8aCTDAOZsMBUmMdQTFwQSBhgaMIYDSiAEqZASGwghsocZ+TmIFRnZ0YuLGiDJlDQYMbmbhJoxSawSmLALmF4ACEQuQWkwkIHvMBPAxzBkAWYwT8D9MB6AgTAIANQwZ0HvGjuIwKUA1MCfBITBkAKMwEME0MBnAxjCWVAA0lMTtNomI9IzTRqaMcnEcLpta6nNBplYaAWMxFUMpRziBwwIpNvtTFxAOITKCU4dUMShjYFM4JfMFnjSlA0NdNSozETswEAMJnTIDYCFJwDAZfcmQIRjIyHEAy0GHAYC5QF1ITBrPMwGREkiMnM0GgspmiDxmpIbozALcMGDzAgky6tO6MTE3IZgwNaGRMRlwGaGMChWY4tmTuRn1GfIeGFJxv8iZyXBWRM1PzMBQSKjKJ0zYIDAMCIQkBmJpxkQack7CQGYiMgQBEA8ZEFnVjZqpIDCQxBFA5CZ2fmLq5mQQTKpi5qDBYzIQMBJDKj4042NyIjHBs2JxEKkYUyGLHQO//vkZJyH/u5hPoP82xAAAA0gAAABOymC/I/zbMgAADSAAAAEpQz5JwAxpvOLPgh5ERIbA+igeadJGngRkYOaCDAwnMuDAN7momRhUKbMFGhlACThYJMTDQFHGunRYGTelwxsSVeaMQGbE5q7oZoDGNAQVcjShsxJONaPDEjU05KNLbQakmeJQlcGCsBMnmKm5iSEDRYyJRNWFyjwOkkzJyM0sPNNrQuOmRuBwJMvMwQLJQ4xhHMwDTAgQx9HBwYuEuyIgExImoZ0AiAwGQA4MCLAEDDLgTcwNoCaMDoBeDAHgDYwTgLhMQbBlDAtQPUwUIDxMBhAozBVgB4wKQB8MOLJUDS+wcI6SnzmQ/N8n0zKexQZGsx+cOVBlMomOS4QAckKoVHJjIknKV0adA5oZyZwxmsB5iJSZ0AjaSbGjHFm4UXQ6PBpoZGSGqJIGky1o4LGBhhqRiYQLAgJGQIe+Ta4o14nNSDTXA8WChbJM8YjAwc0UnNkGBDCmGFRhYGDgUOEjOQkzpfMxDDWxwaozCSAx4JNQDQxYGo4LFB83OaionQABmq8YwYGArYktj0uauKmQPoQWmQoxn54GB5m4MI0A0daMvRzO0E0IxHQcxAxMjiDGzMy41LVGPoJloMABUzVvMEKgoRCheZ0gAEuMWETED0xgaNBTihjMKKwcIGQKAYJmAnBnAmACAw40ViMoFB4LM1JxwPMFKAI0mFGBhLEIwQ14DEnwyMNMmMB69FQUKjZiJoaqcJXCweER5gQwZECGbgpsRqaCSgY5NmITEiIIMzOBUxdBMORzGDcSYzOxVdxUEhoracFRAABJUSiqmGjAREXAYGNPFgaPmZE44gmXC4uAGGAQMNTDj0zcoNRJS7oJODKguHSgjMTAREOUQ4BAAGLDjHIZuHAMTmwChmBxKmN74GbIWGuoFGLKMGLocg6UTE8bzC5HIMMEGo+1zqDC1UorwLeGAqx1asZuVH9DwACAolHNCwiRTSSky4LNtXDSzEiUAcGGVkwOUjEnwwytMbWhGUkJkLdJmKMDmYxdTN3RDMhEKDpjQea8FmfCRj4yYWBKAmk1QGNDLUsteYMMmPHxnISbIkmEj5tgSMxQRbgBVMWJgEIANyMqvRp/MNFgCSmNNoGnQqXG4IwFDTeDg3F9PABTmXkKAQQzGfqRsYYYa1gBDMaPDFwoy8OMdQzOgkHnJmAgaQDmRIBrACYcVmTmJghUYOzmPLAklGJjYYfByeZZDmYERuhW9AFSQcdgqdNEbjfWswkfNFN//vkZI8L/l9hviu+2oAAAA0gAAABOomG8A9zbAAAADSAAAAETTyYxEAITEqiRoYsaUSmJipQamToxjwaTHZj4mYqYpfm1BZFAmZxZoBMMhxgRMZuiESGQHZqhwBgUFPhpDEaAWgaUMwITYi8ygCNmBDPiI0A6NyLRCVEiSQi5ooGaGtGvqgkxGtohvJYbCmBBgCFUaATBgggTS/Bih+YiWG1GxiIYYABDDuBHU2QqBwIYqUmHkJlgYNIgBKTOjU1cAM8TztgcWhBYHL1q9T2lEi4aJIqRkXmQGTCH8YnYMxhFgqGKQHOYZYZhmQi7GEIBwYkA6JhgAymDwDOYGYphgsOwmcuT8ccg5lACmPHCZNmmUNxm64bxTmT656hIajOHgrQ+GCVmQjxhiuAswWqjUkYyIJMLPD4fIz5UNhGTpCs78NFSQ1wfNcHDKQACJ5gbkaaWDQiYKgCJuMEEzHR03ICNaKzGR41gqMGDhCXhwwCpE1hdNuLjZVY0AkNAeQKEmeAJuJUcIdmtEpgBKcS6GNPZmxEZ8NmU1hggyI3EyeNPNojv6AyETMjPDK1YIojV2sxEsMpJy5os7GWgwVJjN0QzYhMQHhhdTNRFFWUy8AMbBDJQ0iOjYSozYkFnIBCwIDjXDkBQxngYa6cmTMZkxSaMtiIJMwqzAqM00YMjYDAXIMLBwMMQKTDSQweqMiRDVlEzRpM0IzUiI0IbDhkyixM+GyAuMFJjTSUwtGEB+ZqUGhCBgqGLUBlQAPOwGIQQWmyiRlJkZI4nRjZkgEYeaGRhwCFTSRAwwcM/IDHwAw4QCoWoSNEggMDNxkzkTMxOiI3YGZgDhYOABedI3m6nhpJIYebJlLjNIOzXTsOGTGgcy1FA1IYIIGEPLbEAGJBAsXu9UtYqjitE0gaM/YDRxAyEeMDDDFWI6cwNMBzIX4qoIMizFwkDQiqzeQODBUdTCsDigoQAMPchK5nCn5CjGBUkuDz2OB1NM6lzMZQ8RVC4hMkWhAwQ0acq0MI1IcDheTOQ5goIwQAaEaJxo1H+9AAcGUArBMCJQUzEqlYzAHSQgkxl0oBCMBkmlg0QuyBrgNagELtmc2TGGEWYYQ8CDlk0hQ06FQIKAATUJR1GiY8gGBgqSjxrGABafIKBMMwGgK0JbCRwXKAEpK0AhjPMFojTCQAGukaIQFcDQgSsmcaogKOUIQFl9AsqpYr1WsZcGpDPCKpJxPhwoyMnEWuTMHgDBABQ51MoJgYKDZDhUOt5z0kAs2XgMI9TFJmEGSI//vkZIyN/GV5vYN9ypIAAA0gAAABK9Xq4ixvBUAAADSAAAAEouBgChoxCwg1J41TkhkSn2EZYC9AEIRSrwICLtF8DaRWqXWWky8KhNeUrMJUHTJMCQQgHA0q0jLkDul6MAa/eikNyqQRutPyirPyirPyirOSutOSutOSutPyirPyirPyjGcldacldacleU/KKs/KKtPUsSQNNiSoCYEiMTwYoeMzJh0wlIMoFjbUA0qJMOhDdzU5gzNvdjEnMx5SMuEDNQwECoa022CqxsJpMQLQjMwx0g9M0BGQJro4qHOYisoayxtpS/LKmiu2+UWooGYavJpbeO7AUPuK6UXd2YgZ2nrfJczC1QF0gQMZUX0IhISWAJnF3U7lY0+VyswZOrCl8xtkilycrP2rONKassdZhqizOENkJqciJRclJ5PMuKiCpgoigBSOUzSZLNBYpINExOtUCkkwU5lgVEmEMvaCxJmLKFxIARCJJRONK1kUXcFyEFgQUYOX8QvL0oJlZ1qIbF7U7ViMeZa8Ujd2An/acnKqgr9BVI5U5ekGiSkSbR9Xk466WZOeoKvFrDU2CuFH6SZfaCIW7sFSN3YKg9yYJg5/o7OQ9HZM/0ek8Ox6fh2PSd/Y7Joejs5D0dkz/SSTw7QT8ZoJO/slk0aoaKNUMVlVnKpMQU1FMy4xMDCqqqq");
        snd.play();
    }, 100);
}

async function listenHotwordMain(event) {
    if (stop_all) { return; };
    let hotwords = conf['sttHotwords'];
    sttSwitch('on', 'keyword');
    sttSwitch('off', 'command');
    console.log("start listen hotwords");
    beep();
    let hasKeywords = await listenKeywords(hotwords)
    if (hasKeywords) {
        beep();
        await listenCommandMain(one_time = false);
        listenHotwordMain();
    } else {
        listenHotwordMain();
    }
}

async function listenCommandMain(one_time = true) {
    if (stop_all) { return; };
    console.log('Start listening for command');
    final_command = '';
    sttSwitch('off', 'keyword');
    sttSwitch('on', 'command');
    if (one_time) {
        console.log('one_time', one_time);
        let command = await listenCommand();
        ele['sttOutput'].innerHTML = command;
        ele['sttStatus'].innerHTML = "Voice input";
    } else {
        let noWords = conf['sttNoWords'];

        // speak keyword
        console.log('sttAnswer', getWord(conf['sttAnswers']));
        await ttsSpeak(getWord(conf['sttAnswers']));
        sttSwitch('on', 'command');
        let command = await listenCommand();
        if (!command) {
            sttSwitch('on', 'keyword');
            return;
        }
        await ttsSpeak(getWord(conf['sttConfirms']) + command);
        sttSwitch('on', 'keyword');
        beep();
        let cancelCommand = await listenKeywords(noWords, true);
        if (!cancelCommand) {
            ele['sttOutput'].innerHTML = "[Command executed]:" + command;
            ele['sttStatus'].innerHTML = 'commit command: ' + command;
            await sendCommandMain(null,  command);
        } else {
            ele['sttOutput'].innerHTML = "[Command canceled]";
            ele['sttStatus'].innerHTML = "Command canceled";
        }
    }
}

async function sendCommandMain(event, query) {
    if (!query) {
        query = ele['sttOutput'].value;
    };
    let answer = '';
    let token = '0';
    ele['sttStatus'].innerHTML = "send command";
    if (conf['gptApiKey'] != "") {
        console.log('ask gpt: ', query);
        appendLogOutput('LOCAL', query);
        [answer, token] = await askChatGPT(query);
        console.log('answer: ', answer);
    } else {
        console.log('ask http: ', query);
        let url = conf['restUrl'] + query;
        appendLogOutput('LOCAL', query);
        answer = await getTextFromUrl(url, 20000);
    }
    appendLogOutput('REMOTE', `Token:${token}, ${answer}`);
    ele['ttsInput'].value = answer;
    if (final_command != '') {
        await ttsSpeak(answer);
    };
    return answer;
}

function stopButtonMain(event) {
    stop_all = true;
    stop_listen_command = true;
    stop_listen_keyword = true;
    ele['sttStatus'].innerHTML = "stop all";
    console.log("stop all");
    clearTimeout(timeoutId);
    window.speechSynthesis.cancel()
    keyword_vr.stop();
    command_vr.stop();
}

function appendLogOutput(type, content) {
    let timestamp = new Date().toLocaleString();
    const separator = type === 'REMOTE' ? '========================================\n' : '----------------------------------------\n';
    ele['logOutput'].value += `${timestamp}\n[${type}]: ${content}\n${separator}`;
}


function getTextFromUrl(url, timeout = 5000) {
    let timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('timeout'));
        }, timeout);
    });
    // handle GET with cors-anywhere
    let xhrPromise = new Promise((resolve, reject) => {
        let cors_api_url = 'https://cors-anywhere.herokuapp.com/';
        let x = new XMLHttpRequest();
        x.open('GET', cors_api_url + url);
        x.onload = function () {
            if (x.status >= 200 && x.status < 400) {
                resolve(JSON.parse(x.responseText).message);
            } else {
                reject(new Error(`fetch error`));
            }
        };
        x.onerror = function () {
            reject(new Error(`fetch error`));
        };
        x.send();
    });

    return Promise.race([xhrPromise, timeoutPromise])
        .catch(error => {
            if (error.message === 'timeout') {
                return 'Timeout error: ' + error.message;
            } else {
                return 'Fetch error: ' + error.message;
            }
        });
}


async function askChatGPT(userMsg) {
    let headers = {
        'Authorization': `Bearer ${conf['gptApiKey']}`,
        'Content-Type': 'application/json'
    };

    let url = 'https://api.openai.com/v1/chat/completions';
    let systemMsg = '';
    if (conf['gptSystemRole']) {
        systemMsg = `${systemMsg} ${conf['gptSystemRole']}.`
    }
    if (conf['gptTokenLimit']){
        systemMsg = `${systemMsg} Must compress ANSWER to less than ${conf['gptTokenLimit']} token.`;
    }
    if (conf['gptReplyLanguage']) {
        systemMsg = `${systemMsg} Reply in ${conf['gptReplyLanguage']}.`;
    }

    let data = {
        'model': 'gpt-3.5-turbo',
        'messages': msgMaker(systemMsg,userMsg),
        'temperature': 0.8,
        'n': 1,
        'top_p': 1,
        'stream': false,
        'max_tokens': 2000,
    };
    console.log('header:',headers);
    console.log('data:',data);
    try {
        
        let response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        if (response.status === 200) {
            let responseJson = await response.json();
            console.log(responseJson);
            let promptTokens = responseJson['usage']['prompt_tokens'];
            let completionTokens = responseJson['usage']['completion_tokens'];
            let responseResult = responseJson['choices'][0]['message']['content'];
            console.log('responseResult:',responseResult);
            //add to history
            msgHistory.push({'role': 'user', 'content': userMsg});
            msgHistory.push({'role': 'assistant', 'content': responseResult});
            return [responseResult,`(${promptTokens}+${completionTokens})`];
        } else {
            console.error('Error:', response.status, response.statusText);
            return [response.statusText,"0"];
        }
    } catch (error) {
        console.error('Error:', error);
        return [error,"0"];
    }
}

function msgMaker(systemMsg, userMsg,limit=2) {
    let messages = [];
    
    messages.push({
      'role': 'system',
      'content': systemMsg
    });
  
    let historyLength = msgHistory.length;
    let startIdx = historyLength >= limit ? historyLength - limit : 0;
    
    for (let i = startIdx; i < historyLength; i++) {
      messages.push(msgHistory[i]);
    }
    messages.push({
        'role': 'user',
        'content': userMsg
      });
    return messages;
  }

document.addEventListener('DOMContentLoaded', function () {
    if (typeof speechSynthesis !== 'undefined') {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = populateVoiceList;
        }
        populateVoiceList();
    } else {
        alert('Your browser does not support Web Speech API!');
    }

    if (localStorage.getItem('config')) {
        let storedConfig = JSON.parse(localStorage.getItem('config'));
        Object.assign(conf, storedConfig);
        configToPage();
    }
});
