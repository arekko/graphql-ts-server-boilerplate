import * as SparkPost from 'sparkpost';
const client = new SparkPost("8eefd15a3b3572e9590800c9d9a4f6bac4268acb");


export const sendEmail = async (recipient: string, url: string) => {
const response = await client.transmissions.send({
    options: {
      sandbox: true
    },
    content: {
      from: 'testing@sparkpostbox.com',
      subject: 'Confirm email',
      html:`<html>
              <body>
                <p>
                  Testing SparkPost - the world\'s most awesomest email service!
                </p>
                <a href="${url}">confirm email</a>j
              </body>
            </html>`
    },
    recipients: [
      {address: recipient }
    ]
  })

  console.log(response);
}; 