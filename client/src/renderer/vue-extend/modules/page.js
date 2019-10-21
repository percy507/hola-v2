function toLoginPage() {
  localStorage.clear();
  this.$win.setSize(280, 400);
  this.$win.center();

  // clear local data
  this.$electronStore.clear();

  // clear all state
  this.$store.dispatch('clearAllState');

  this.$router.push({
    path: '/login'
  });
}

function toHomePage() {
  this.$win.setSize(885, 550);
  this.$win.center();

  this.$router.push({
    path: '/app/chat'
  });
}

export default {
  toLoginPage,
  toHomePage
};
