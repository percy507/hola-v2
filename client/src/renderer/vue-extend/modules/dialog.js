function showErrorDialog(msg) {
  this.$remote.dialog.showErrorBox(msg.title, msg.content);
}

function showMessageDialog(options, callback) {
  this.$remote.dialog.showMessageBox(
    this.$win,
    {
      ...options,
      title: 'Hola' // for windows
    },
    callback
  );
}

export default {
  showErrorDialog,
  showMessageDialog
};
