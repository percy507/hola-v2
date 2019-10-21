function handleResponseError(eventName, response) {
  this.$remote.dialog.showErrorBox(eventName, response.message);
}

export default {
  handleResponseError
};
