// Formulaire de contact : envoi via Web3Forms (https://web3forms.com).
// La clé d'accès est publique par conception : elle ne permet que d'envoyer
// des messages vers l'adresse associée, jamais de lire quoi que ce soit.
const WEB3FORMS_ACCESS_KEY = '93c761d1-4ee2-48d0-8f04-8ba2662bdc13';

// Le partial est injecté de façon asynchrone : on délègue l'écoute au document.
document.addEventListener('submit', async (event) => {
    const form = event.target;
    if (form.id !== 'contactForm') return;
    event.preventDefault();

    const status = document.getElementById('contactStatus');
    const submit = document.getElementById('contactSubmit');
    const setStatus = (text, ok) => {
        status.textContent = text;
        status.className = `text-sm font-space-mono ${ok ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`;
    };

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return; // robot détecté : on ignore silencieusement

    const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `[habl.me] ${data.subject_user || 'Nouveau message'}`,
        from_name: 'Portfolio habl.me',
        name: data.name,
        email: data.email, // devient le Reply-To : il suffit de répondre au mail
        message: data.message,
    };

    submit.disabled = true;
    submit.classList.add('opacity-60', 'cursor-not-allowed');
    status.textContent = 'Envoi en cours…';
    status.className = 'text-sm font-space-mono text-gray-500';

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (response.ok && result.success) {
            form.reset();
            setStatus('Merci ! Votre message a bien été envoyé.', true);
        } else {
            throw new Error(result.message || `HTTP ${response.status}`);
        }
    } catch (error) {
        console.error('Erreur envoi formulaire de contact :', error);
        setStatus("Échec de l'envoi. Réessayez ou écrivez à habibhalirou@gmail.com.", false);
    } finally {
        submit.disabled = false;
        submit.classList.remove('opacity-60', 'cursor-not-allowed');
    }
});
