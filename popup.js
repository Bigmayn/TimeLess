document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reminderForm');
  
  // Load saved reminder data
  chrome.storage.sync.get(['reminderData'], function(result) {
    if (result.reminderData) {
      document.getElementById('link').value = result.reminderData.link;
      document.getElementById('message').value = result.reminderData.message;
      document.getElementById('startTime').value = result.reminderData.startTime;
      document.getElementById('endTime').value = result.reminderData.endTime;
      document.getElementById('interval').value = result.reminderData.interval;
      
      const daysSelect = document.getElementById('days');
      result.reminderData.days.forEach(day => {
        daysSelect.options[day].selected = true;
      });
    }
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const link = document.getElementById('link').value;
    const message = document.getElementById('message').value;
    const days = Array.from(document.getElementById('days').selectedOptions).map(option => parseInt(option.value));
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const interval = parseInt(document.getElementById('interval').value);

    const reminderData = { link, message, days, startTime, endTime, interval };

    chrome.storage.sync.set({ reminderData }, function() {
      console.log('Reminder data saved');
    });

    chrome.runtime.sendMessage({ action: 'setAlarm', data: reminderData });

    window.close();
  });
});