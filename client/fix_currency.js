const fs = require('fs');

function replaceFile(path, replacements) {
    let content = fs.readFileSync(path, 'utf8');
    for (let r of replacements) {
        content = content.replace(r.old, r.new);
    }
    fs.writeFileSync(path, content, 'utf8');
}

replaceFile('src/components/AuthModal.jsx', [
    {old: 'Session Price ($)', new: 'Session Price (ETB)'}
]);

replaceFile('src/pages/AdminPage.jsx', [
    {old: 'Session Price ($)', new: 'Session Price (ETB)'},
    {old: '\\$\/session\', new: '\ETB \/session\'}
]);

replaceFile('src/pages/BookingPage.jsx', [
    {old: '\\$\\', new: '\ETB \\'}
]);

replaceFile('src/pages/LandingPage.jsx', [
    {old: '\\$\\', new: '\ETB \\'}
]);

replaceFile('src/pages/TherapistsPage.jsx', [
    {old: '\\$\\', new: '\ETB \\'}
]);

