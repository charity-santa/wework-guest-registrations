
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-121866338-3']);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector('#updateGuestInfoButton');
    button.addEventListener('click', () => {
        _gaq.push(['_trackEvent', 'sendGuestInvitation', 'clicked']);
    });
});