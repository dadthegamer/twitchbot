const resetWeek = document.getElementById('reset-week');

resetWeek.addEventListener('click', async () => {
    console.log('Resetting week');
    const response = await fetch('/api/reset', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reset: 'week' })
    });
    const data = await response.json();
    console.log(data);
});