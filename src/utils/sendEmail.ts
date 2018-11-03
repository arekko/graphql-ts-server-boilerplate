import * as SparkPost from 'sparkpost';
const client = new SparkPost(process.env.SPARKPOST_API_KEY);


export const sendEmail = async (recipient: string, url: string) => {
const response = await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Confirm email',
      html:'<html><body><p>Testing SparkPost - the world\'s most awesomest email service!</p></body></html>'
    },
    recipients: [
      {address: recipient }
    ]
  })

  console.log(response);
}; 