
const isMarthaAround = true; // setting a condition at first

const greetMartha = new Promise((resolve,reject) => { // promise to handle the condition we have set at first!
    if (isMarthaAround) {
        resolve('Martha says Hello')
    } else {
        reject('Martha is not around now!')
    }
})

try {
    (async () => { // self invoking function to make sure that the function runs on program runs
        const response = await greetMartha
        console.log(response)
    })().catch(
        err => console.log('smth happened!', err.message)
    )
} catch (error) {
    console.log(error);
}
