<script>
function sendEvent(param) {
    gtag('event', 'download', {
        'event_category': 'portal_downloads',
        'event_label': param
    });
}
</script>