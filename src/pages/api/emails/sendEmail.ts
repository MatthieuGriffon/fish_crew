import * as Mailjet from "node-mailjet";

const mailjet = Mailjet.connect(process.env.MAILJET_API_KEY!, process.env.MAILJET_API_SECRET!);

// ... le reste de votre code


export default async function handler(req: { method: string; body: { recipientEmail: any; recipientName: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; end: { (): void; new(): any; }; }; }) {
  if (req.method === 'POST') {
    const { recipientEmail, recipientName } = req.body;
    
    try {
      const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
          "Messages": [{
            "From": {
              "Email": "contact@matthieu-griffon.fr",
              "Name": "matthieu"
            },
            "To": [{
              "Email": recipientEmail,
              "Name": recipientName
            }],
            "Subject": "Greetings from Mailjet.",
            "TextPart": "My first Mailjet email",
            "HTMLPart": "<h3>Welcome to Mailjet!</h3><br />May the delivery force be with you!",
            "CustomID": "AppGettingStartedTest"
          }]
        });

      const result = await request;
      res.status(200).json(result.body);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  } else {
    res.status(405).end(); 
  }
}
