async function onTrack(event, settings) {
	console.log('event.event: ' + event.event);
	if (event.event !== settings.eventName) {
		return;
	}

	const vaccine = event.properties.vaccineName;

	const Body =
		`Owl Health: You are overdue for your ` +
		vaccine +
		` immunization. Please schedule an appointment.`;
	const To = settings.twilioDestinationNumber;

	if (settings.twilioFrom) {
		await sendText(
			{
				From: settings.twilioFrom,
				To,
				Body
			},
			settings
		);
	}

	if (settings.twilioWhatsAppFrom) {
		// Learn more at: https://www.twilio.com/docs/whatsapp
		await sendText(
			{
				To: 'whatsapp:' + To,
				From: settings.twilioWhatsAppFrom,
				Body
			},
			settings
		);
	}
}

/**
 * Sends SMS or WhatsApp message with Twilio
 *
 * https://www.twilio.com/docs/sms
 *
 */
async function sendText(params, settings) {
	const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${settings.twilioAccountId}/Messages.json`;
	await fetch(endpoint, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(
				settings.twilioAccountId + ':' + settings.twilioToken
			)}`,
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		body: toFormParams(params)
	});
}

function toFormParams(params) {
	return Object.entries(params)
		.map(([key, value]) => {
			const paramName = encodeURIComponent(key);
			const param = encodeURIComponent(value);
			return `${paramName}=${param}`;
		})
		.join('&');
}
