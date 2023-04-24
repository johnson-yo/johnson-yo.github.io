// define variables
const CONFIG = {
    restUrl: '',
    sttLanguage: '',
    ttsVoice1: '',
    ttsVoice2: '',
    ttsVoice3: '',
    ttsVoice4: '',
    ttsVoice1Select: '',
    ttsVoice2Select: '',
    ttsVoice3Select: '',
    ttsVoice4Select: '',
    ttsVolume: '1',
    ttsRate: '1',
    ttsPitch: '1',
    sttTimeout: '5',
    sttHotwords: '',
    sttAnswers: '',
    sttConfirms: '',
    sttNoWords: ''
};
const configContent = document.getElementById('config-content');
// button
const configButton = document.getElementById('configButton');
const commitButton = document.getElementById('commit');
const resetButton = document.getElementById('reset');
const exportButton = document.getElementById('export');
const importButton = document.getElementById('import');
const listenHotwordButton = document.getElementById('listenHotword');
const listenCommandButton = document.getElementById('listenCommand');
const stopButton = document.getElementById('stop');
const sendButton = document.getElementById('send');
const ttsInput = document.getElementById('ttsInput');
const speakButton = document.getElementById('speak');
const cleanButton = document.getElementById('clean');
const saveButton = document.getElementById('save');

listenHotwordButton.addEventListener("click",function(){stop_all=false;listenHotwordMain()});
listenCommandButton.addEventListener("click",function(){stop_all=false;listenCommandMain()});
stopButton.addEventListener("click",stopButtonMain);
sendButton.addEventListener("click",sendCommandMain);

// input
const restUrl = document.getElementById('restUrl');
const sttLanguage = document.getElementById('sttLanguage');
const ttsVoice1 = document.getElementById('ttsVoice1');
const ttsVoice2 = document.getElementById('ttsVoice2');
const ttsVoice3 = document.getElementById('ttsVoice3');
const ttsVoice4 = document.getElementById('ttsVoice4');
const ttsVoice1Select = document.getElementById('ttsVoice1Select');
const ttsVoice2Select = document.getElementById('ttsVoice2Select');
const ttsVoice3Select = document.getElementById('ttsVoice3Select');
const ttsVoice4Select = document.getElementById('ttsVoice4Select');
const ttsVolume = document.getElementById('ttsVolume');
const ttsRate = document.getElementById('ttsRate');
const ttsPitch = document.getElementById('ttsPitch');
const sttTimeout = document.getElementById('sttTimeout');
const sttHotwords = document.getElementById('sttHotwords');
const sttAnswers = document.getElementById('sttAnswers');
const sttConfirms = document.getElementById('sttConfirms');
const sttNoWords = document.getElementById('sttNoWords');
// output
const sttStatus = document.getElementById('sttStatus');
const sttResult = document.getElementById('sttOutput');
const logOutput = document.getElementById('logOutput');

var voiceNameVars = {}

// 按下"COMMIT"按鈕時，頁面上的值將更新CONFIG內的各變量的值
commitButton.addEventListener('click', function () {
   pageToConfig();
});

// 按下"RESET"按鈕時，清空頁面上各CONFIG內的各變量的值
resetButton.addEventListener('click', function () {
    pageToConfig(true);
});

// 按下"EXPORT"按鈕時，將各CONFIG內的各變量的值輸入成json格式，執行下載
exportButton.addEventListener('click', function () {
    pageToConfig();    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(CONFIG));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "browser-bot-config.json");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});

// 按下"IMPORT"按鈕時，通過Browse選中local中json文件，讀取後更新CONFIG內的各變量的值
importButton.addEventListener('click', function () {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const importedConfig = JSON.parse(e.target.result);
            Object.assign(CONFIG, importedConfig);
            configToPage();
        };
        reader.readAsText(file);
    });
    fileInput.click();
});


// 按下"CLEAN"按鈕時，清空logOutput中內容
cleanButton.addEventListener('click', function () {
    logOutput.value = '';
});

// 按下"SAVE"按鈕時, 將logOutput中內容保存到local
saveButton.addEventListener('click', function () {
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(logOutput.value);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "browser-bot-log.txt");
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
});


//  CONFIG var to PAGE var
function configToPage(reset=false) {
    restUrl.value = reset==true?'':CONFIG.restUrl;
    sttLanguage.value = reset==true?'':CONFIG.sttLanguage;
    ttsVoice1.value = reset==true?'':CONFIG.ttsVoice1;
    ttsVoice2.value = reset==true?'':CONFIG.ttsVoice2;
    ttsVoice3.value = reset==true?'':CONFIG.ttsVoice3;
    ttsVoice4.value = reset==true?'':CONFIG.ttsVoice4;
    ttsVoice1Select.value = reset==true?'':CONFIG.ttsVoice1Select;
    ttsVoice2Select.value = reset==true?'':CONFIG.ttsVoice2Select;
    ttsVoice3Select.value = reset==true?'':CONFIG.ttsVoice3Select;
    ttsVoice4Select.value = reset==true?'':CONFIG.ttsVoice4Select;
    ttsVolume.value = reset==true?'':CONFIG.ttsVolume;
    ttsRate.value = reset==true?'':CONFIG.ttsRate;
    ttsPitch.value = reset==true?'':CONFIG.ttsPitch;
    sttTimeout.value = reset==true?'':CONFIG.sttTimeout;
    sttHotwords.value = reset==true?'':CONFIG.sttHotwords;
    sttAnswers.value = reset==true?'':CONFIG.sttAnswers;
    sttConfirms.value = reset==true?'':CONFIG.sttConfirms;
    sttNoWords.value = reset==true?'':CONFIG.sttNoWords;
    // setup voice var
    voiceNameVars[CONFIG.ttsVoice1.toLowerCase()] = CONFIG.ttsVoice1Select
    voiceNameVars[CONFIG.ttsVoice2.toLowerCase()] = CONFIG.ttsVoice2Select
    voiceNameVars[CONFIG.ttsVoice3.toLowerCase()] = CONFIG.ttsVoice3Select
    voiceNameVars[CONFIG.ttsVoice4.toLowerCase()] = CONFIG.ttsVoice4Select
}

// PAGE var to CONFIG var
function pageToConfig(reset=false) {
    CONFIG.restUrl = reset==true?'':restUrl.value;
    CONFIG.sttLanguage = reset==true?'':sttLanguage.value;
    CONFIG.ttsVoice1 = reset==true?'':ttsVoice1.value;
    CONFIG.ttsVoice2 = reset==true?'':ttsVoice2.value;
    CONFIG.ttsVoice3 = reset==true?'':ttsVoice3.value;
    CONFIG.ttsVoice4 = reset==true?'':ttsVoice4.value;
    CONFIG.ttsVoice1Select = reset==true?'':ttsVoice1Select.value;
    CONFIG.ttsVoice2Select = reset==true?'':ttsVoice2Select.value;
    CONFIG.ttsVoice3Select = reset==true?'':ttsVoice3Select.value;
    CONFIG.ttsVoice4Select = reset==true?'':ttsVoice4Select.value;
    CONFIG.ttsVolume = reset==true?'':ttsVolume.value;
    CONFIG.ttsRate = reset==true?'':ttsRate.value;
    CONFIG.ttsPitch = reset==true?'':ttsPitch.value;
    CONFIG.sttTimeout = reset==true?'':sttTimeout.value;
    CONFIG.sttHotwords = reset==true?'':sttHotwords.value;
    CONFIG.sttAnswers = reset==true?'':sttAnswers.value;
    CONFIG.sttConfirms = reset==true?'':sttConfirms.value;
    CONFIG.sttNoWords = reset==true?'':sttNoWords.value;
    if (reset==true) {
        configToPage(reset);
    }
    // 将 CONFIG 保存到 localStorage
    localStorage.setItem('config', JSON.stringify(CONFIG));
    // setup voice var
    voiceNameVars[CONFIG.ttsVoice1.toLowerCase()] = CONFIG.ttsVoice1Select
    voiceNameVars[CONFIG.ttsVoice2.toLowerCase()] = CONFIG.ttsVoice2Select
    voiceNameVars[CONFIG.ttsVoice3.toLowerCase()] = CONFIG.ttsVoice3Select
    voiceNameVars[CONFIG.ttsVoice4.toLowerCase()] = CONFIG.ttsVoice4Select
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
        sttLanguage.appendChild(langOption);
    });

    // tts language options
    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
        voices.forEach(voice => {
            const voiceOption = document.createElement('option');
            voiceOption.value = `[${voice.lang}]:${voice.name}`;
            voiceOption.textContent = `[${voice.lang}]:${voice.name}`;
            ttsVoice1Select.appendChild(voiceOption.cloneNode(true));
            ttsVoice2Select.appendChild(voiceOption.cloneNode(true));
            ttsVoice3Select.appendChild(voiceOption.cloneNode(true));
            ttsVoice4Select.appendChild(voiceOption.cloneNode(true));
        });
        configToPage();
}};

// setup tts speak button
function ttsSpeak(text) {
    return new Promise((resolve, reject) => { 
    var voiceName = ttsVoice1Select.value;
    var voiceText = text;   
    if (text.includes("[") && text.includes("]")) {
        var voiceNameVar = text.split('[')[1].split(']')[0].toLowerCase();
        if (voiceNameVar in voiceNameVars) {
            voiceName = voiceNameVars[voiceNameVar];
        }
        var voiceText = text.split(']')[1];
    }
    let utterThis = new SpeechSynthesisUtterance(voiceText);
    // const utterThis = new SpeechSynthesisUtterance(ttsInput.value);
    utterThis.voice = speechSynthesis.getVoices().filter(function (voice) {
        return `[${voice.lang}]:${voice.name}` == voiceName;
    })[0];
    console.log(voiceName)
    utterThis.onend= function () {
        resolve(true);
    };
    utterThis.volume = parseFloat(CONFIG.ttsVolume);
    utterThis.rate = parseFloat(CONFIG.ttsRate);
    utterThis.pitch = parseFloat(CONFIG.ttsPitch);
    speechSynthesis.speak(utterThis);
    });
}

//setup config show/hide button
configButton.addEventListener("click", function () {
    if (configContent.style.display == 'none') { 
        configContent.style.display = '' 
    } else { 
        configContent.style.display = 'none' 
    }
});

// setup speak button
speakButton.addEventListener("click", function () {
    ttsSpeak(ttsInput.value);
});

//https://stackoverflow.com/questions/41373579/the-effect-of-the-grammar-in-the-web-speech-api
function detectKeywords(phrases, results) {
    // Loop through the alternatives to check if any of our hot phrases are contained in them.
    for (let idx in results) {
      let transcript = results[idx].transcript;
      let pattern = new RegExp(phrases.map(p => p.toLowerCase()).join("|"), "i");
      if (pattern.test(transcript)) {
        console.log(`transcript: ${transcript},pattern: ${pattern}`)
        console.log(`Got keywords`)
        return transcript; // Return them if they are
      }
    }
    return false; // Otherwise return the highest confidence
  }

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
//const SpeechRecognition = window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;
//const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
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

function listenKeywords(keywords,one_time=false) {
    return new Promise((resolve, reject) => {
    // try {
    //     delete keyword_vr;
    // } catch (error) {
    //     error;
    // }
    keyword_vr = new SpeechRecognition();
    keyword_vr.continuous = false;
    keyword_vr.lang = CONFIG.sttLanguage;
    keyword_vr.interimResults = true;
    keyword_vr.alternatives = true;
    keyword_vr.maxAlternatives = 10;
    
    console.log('keyword_vr keywords:',keywords)

    function restartKeywordRecognition(has_keyword) {
        console.log('stop_listen_keyword: ',stop_listen_keyword)
        if (!stop_listen_keyword && !stop_all) {
            setTimeout(() => {
                try {
                    keyword_vr.start();
                } catch (error) {
                    error;
                }
            }, 100);
            if (one_time){
                sttSwitch('off','keyword');
            }
        } else {
            keyword_vr.stop();
            resolve(has_keyword);
        }
    }

    keyword_vr.onsoundstart = function () {
        console.log('keyword_vr onsoundstart')
        sttStatus.innerHTML = "listening for hotwords";
    };

    keyword_vr.onend = function () {
        console.log('keyword_vr onend: ',stop_listen_keyword);
        if (!stop_listen_keyword && !stop_all) {
            restartKeywordRecognition(false);
        } else {
            keyword_vr.stop();
            sttStatus.innerHTML = "stopped";
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
                sttResult.innerHTML = `[Got hotwords]:${results[0].transcript}`;
                sttSwitch('off','keyword');
                restartKeywordRecognition(true);
            } else{
                restartKeywordRecognition(false);
            }
        } else if (results[0].transcript != "") {
            sttResult.innerHTML = `[Detecting hotwords]:${results[0].transcript}\n` + sttResult.innerHTML;
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
    command_vr.lang = CONFIG.sttLanguage;
    command_vr.interimResults = true;
    let isSpeechEnd = false;
    let output = '';
    let prevInnerHTML = '';


    function restartCommandRecognition() {
        if (!stop_listen_command && !isSpeechEnd && !stop_all) {
            setTimeout(() => { command_vr.start();}, 100);
        } else if (isSpeechEnd) {
            sttSwitch('off','command');
            command_vr.stop();
            sttStatus.innerHTML = 'final_command: ' + final_command;
            resolve(final_command);
        }
    }

    command_vr.onsoundstart = function () {
        sttStatus.innerHTML = 'onsoundstart';
        console.log('command_vr onsoundstart');
        isSpeechEnd = true;
        sttStatus.innerHTML = "listening for command";
    };

    command_vr.onend = function () {
        sttStatus.innerHTML = 'onend';
        console.log('command_vr onend');
        if (!stop_listen_command){
            restartCommandRecognition();
        } 
        sttStatus.innerHTML = `Wait ${CONFIG.sttTimeout} second for commit`;
        prevInnerHTML = sttResult.innerHTML;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (prevInnerHTML === sttResult.innerHTML) {
                isSpeechEnd = true;
                restartCommandRecognition();
            }
        }, parseFloat(CONFIG.sttTimeout)*1000);
        
    };

    command_vr.onerror = (event) => {
        //sttStatus.innerHTML = "error";
        //sttResult.innerHTML = `[Errors]:${event.error}\n` + sttResult.innerHTML;
        console.log('command_vr onerror');
        if (event.error == 'no-speech'){
            isSpeechEnd = true;
        }
        restartCommandRecognition();
    };

    command_vr.onspeechend = () => {
        sttStatus.innerHTML = 'onspeechend';
        console.log('command_vr onspeechend');
    };

    command_vr.onresult = (event) => {
        sttStatus.innerHTML = 'onresult';
        console.log('command_vr onresult');
        let results = event.results[0]
        console.log(results);
        if (results.isFinal) {
            isSpeechEnd = false;
            final_command =  final_command + " " +results[0].transcript;
            output = '';
            sttResult.innerHTML =`[Command]: ${final_command}`;
        } else if (results[0].transcript != "") {
            output = output + ` / ${results[0].transcript} `;
            sttResult.innerHTML = `[Command]: ${final_command} (${output})`
            isSpeechEnd = false;
            clearTimeout(timeoutId);
        }
    };

    restartCommandRecognition();
    })
}

function getWord(words) {
    if (words.includes(";")){
        var wordArray = words.split(";").filter(function(word) {
            return word !== "";
          });
        var randomIndex = Math.floor(Math.random() * wordArray.length);
        return wordArray[randomIndex];
    } else if (words.length == 0) {
        return false;
    } else {
        return words;
    }
}

async function listenHotwordMain(event){
    if (stop_all){ return;};
    let hotwords = CONFIG.sttHotwords;
    if (hotwords.includes(';')){
        hotwords = hotwords.split(";")
                    .map(keyword => keyword.trim())
                    .filter(keyword => keyword !== "");
    } else {
        hotwords = [hotwords];
    }
    sttSwitch('on','keyword');
    sttSwitch('off','command');
    console.log("start listen hotwords");
    let hasKeywords = await listenKeywords(hotwords)
    if (hasKeywords){
        await listenCommandMain(one_time=false);
    }  else {
        listenHotwordMain();
    }
}

async function listenCommandMain(one_time=true){
    if (stop_all){ return;};
    console.log('Start listening for command');
    final_command = '';
    sttSwitch('off','keyword');
    sttSwitch('on','command');
    if (one_time){
        console.log('one_time',one_time);
        let command = await listenCommand();
        sttResult.innerHTML = command;
        sttStatus.innerHTML = "Voice input";
    } else {
        // speak keyword
        console.log('sttAnswer',getWord(CONFIG.sttAnswers));
        await ttsSpeak(getWord(CONFIG.sttAnswers));
        console.log('sttAnswer',getWord(CONFIG.sttAnswers));
        sttSwitch('on','command');
        let command = await listenCommand();
        if (command == ''){
            listenHotwordMain();
            return;
        }
        await ttsSpeak(getWord(CONFIG.sttConfirms)+command);
        let noWords = CONFIG.sttNoWords;
        if (!noWords.includes(';')){
            noWords = [noWords];
        } else {
            noWords = noWords.split(";")
                        .map(keyword => keyword.trim())
                        .filter(keyword => keyword !== "");
        }
        sttSwitch('on','keyword');
        let cancelCommand = await listenKeywords(noWords,true);
        if (!cancelCommand){
            sttResult.innerHTML = "[Command executed]:" + command ;
            sttStatus.innerHTML = 'commit command: ' + command;
            let answer = await sendCommandMain(query=command);
            listenHotwordMain();
        } else {
            sttResult.innerHTML = "[Command canceled]";
            sttStatus.innerHTML = "Command canceled";
            listenHotwordMain();
        }
    }
}

async function sendCommandMain(event,query=""){
    sttStatus.innerHTML = "send command";
    if (query==""){
        query = final_command;
    }
    let url = CONFIG.restUrl + query ;
    appendLogOutput('LOCAL', query);
    answer = await getTextFromUrl(url,20000);
    appendLogOutput('REMOTE', answer);
    ttsInput.value = answer;
    await ttsSpeak(answer);
    return answer;
}

function stopButtonMain(event){
    stop_all = true;
    stop_listen_command = true;
    stop_listen_keyword = true;
    sttStatus.innerHTML = "stop all";
    console.log("stop all");
    clearTimeout(timeoutId);
    keyword_vr.stop();
    command_vr.stop();
}    

function appendLogOutput(type, content) {
    let timestamp = new Date().toLocaleString();
    const separator = type === 'REMOTE' ? '========================================\n' : '----------------------------------------\n';
    logOutput.value += `${timestamp}\n[${type}]: ${content}\n${separator}`;
}


function getTextFromUrl(url, timeout = 5000) {
    // 创建一个超时Promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, timeout);
    });
    if (url.includes('http://')){
        url = 'https://cors-anywhere.herokuapp.com/' + url
    };
    // 使用fetch获取文本
    const fetchPromise = fetch(url)
      .then(response => {
        if (!response.ok) {
            throw new Error(`fetch error`);
        }
        return response.json();
      })
      .then(jsonData => {
        return jsonData.message;
      });
  
    return Promise.race([fetchPromise, timeoutPromise])
      .catch(error => {
        if (error.message === 'timeout') {
          return 'Timeout error: ' + error.message;
        } else {
          return 'Fetch error: ' + error.message;
        }
      });
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
        const storedConfig = JSON.parse(localStorage.getItem('config'));
        Object.assign(CONFIG, storedConfig);
        configToPage();
    }
});
