let currentAlarm;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setAlarm') {
    setAlarm(request.data);
  }
});

function setAlarm(data) {
  if (currentAlarm) {
    chrome.alarms.clear(currentAlarm);
  }

  const alarmInfo = {
    periodInMinutes: data.interval
  };

  chrome.alarms.create('reminderAlarm', alarmInfo);
  currentAlarm = 'reminderAlarm';

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'reminderAlarm') {
      checkAndNotify(data);
    }
  });
}

function checkAndNotify(data) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5);

  if (data.days.includes(currentDay) && currentTime >= data.startTime && currentTime <= data.endTime) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Reminder',
      message: data.message,
      buttons: [{ title: 'Open Link' }],
      priority: 2
    });
  }
}

chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    chrome.storage.sync.get(['reminderData'], function(result) {
      if (result.reminderData && result.reminderData.link) {
        chrome.tabs.create({ url: result.reminderData.link });
      }
    });
  }
});

// Load saved reminder data and set alarm on extension startup
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get(['reminderData'], function(result) {
    if (result.reminderData) {
      setAlarm(result.reminderData);
    }
  });
});