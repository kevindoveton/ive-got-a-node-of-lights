# I've got a node of lights!
Create crazy light shows using your mobile phone!

I was approached about the possibility of creating a "light experience" in which a persons mobile phone was synchronised to an 
external light show, similar to the wrist band Coldplay uses in their concerts. Initially I thought that web sockets would be 
best method for synchronising thousands due to their fast response times and the ability to have thousands of connections with
minimal resources, however the response time was nowhere near fast enough and delays were extremely obvious to the human eye,
even whilst over a LAN connection. 

I then decided to explore using the HTML5 audio api. This worked perfectly but at the time wasn't supported in iOS, although
I believe that it is now supported as of iOS11. The implementation involved adding a 20kHz tone to the audio track, Humans can't
hear this but the phone can. As it had no reliance on the web (except delivery of the initial sequence, which happened on app load)
there was no visible delay between devices and could scale indefinitely. 
