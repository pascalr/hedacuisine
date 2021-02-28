$("#inputcommandform").bind('ajax:success', function(data, status, xhr) {
  let inputCmd = document.getElementById('inputcommand');
  inputCmd.value = '';
  inputCmd.focus();
})

document.addEventListener("logoutput-loaded", function(event) {
  let action_required_div = document.getElementById('actionrequired');
  if (action_required_div) {
    action_required = action_required_div.getAttribute('data-val');
    if (action_required && action_required.startsWith("identify")) {
      console.log('Stopping async poll during identify action');
      let container = document.getElementById('async-container')
      container.dispatchEvent(new Event('async-stop'));
    }
  }
  document.getElementById('inputcommand').focus();
});
