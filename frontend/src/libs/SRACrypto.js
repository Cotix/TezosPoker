/**
* @file Asynchronous SRA cryptosystem interface.
*
* @version 0.2.0
*/
import WorkerHost from "./WorkerHost";
import urls from '../assets.urls';

const _defaultHostScript = urls['./libs/SRACryptoWorker.js']; //default WorkerHost script
let _hosts = new Array();
let _queue = new Array(); //queue of requests; automatically adjusted as WorkerHosts become available (ready)
let _maxHosts = 4; //max number of concurrent Workerhost instances
let _numHosts = 0; //current number of WorkerHost instances
/**
* @class Uses Web Workers to asynchronously perform various SRA cryptosystem
* functions.
*
* @see {@link SRACryptoWorker.js}
*/
class SRACrypto {

   /**
   * An encryption/decryption key pair and associated prime value. A <code>null</code>
   * object indicates that the keypair is being generated. All values
   * are either in hexadecimal (pre-pended with "0x"), or decimal. Keys may be
   * swapped prior to first use if desired.
   *
   * @typedef {Object} keypair
   * @property {String} encKey A string representation of the encryption key.
   * @property {String} decKey A String representation of the decryption key.
   * @property {String} prime A string representation of the associated prime number.
   *
   *
   */

   /**
   * Creates an instance of the SRACrypto class.
   *
   * @constructs
   * @param {Number} [hostInstances=4] The maximum number of concurrent {@link WorkerHost}
   * instances to use / manage within the new SRACrypto instance.
   */
   constructor (hostInstances) {
      if (isNaN(hostInstances) == false) {
         _maxHosts = hostInstances;
      }
      for (var count = 0; count < hostInstances; count++) {
         var newHost = new WorkerHost(_defaultHostScript, true);
         newHost.addEventListener("ready", this.onHostReady)
         SRACrypto.workerHosts.push (newHost);
      }
   }

   /**
   * Invokes an asynchronous SRA cryptosystem method using a free {@link WorkerHost}
   * instance. If no instance is currently available the request is added to
   * the queue and made when the first available host signals that it's ready.
   *
   * @param {String} method The method to invoke in the hosted Worker instance.
   * @param {Object} params The parameters to invoke the method with.
   * @param {*} [requestID=undefined] A request ID that can be used to track the
   * request over its lifetime (useful when re-assembling multiple discrete
   * invokations that could otherwise result in a race condition).
   *
   * @return {Promise} An asynchronous promise object that will either resolve
   * and return a result (data type and format vary depending on the method
   * invoked), or a rejection / error throw.
   *
   * @example
   * //simple 1 worker example
   * let SRA = new SRACrypto (1);
   *
   * //generate a random, 1024-bit prime value and return it in the given radix (base):
   * //MUST BE either -> 16 (hex) or 10 (decimal) -- other bases not internally recognized by
   * //crypto worker.
   * SRA.invoke("randomPrime", {bitLength:1024, radix:16}).then(event => {
   *   console.log ("Generated prime value (hex): " + event.data.result);
   * });
   *
   * @example
   * //using 2 workers; here we don't care about the order of generated keypairs
   * var SRA = new SRACrypto(2);
   *
   * //generate 25 random keypairs (usually we want just one)
   * for (var count = 0; count < 25; count++) {
   *   //"primeVal" was pre-generated in a previous step; MUST BE in hex or decimal (radix=16 or radix=10)
   *   SRA.invoke("randomKeypair", {prime:primeVal}).then(event =>
   *   {
   *        console.log ("Generated keypair: "+JSON.stringify(event.data.result));
   *   });
   * }
   *
   * @example
   * //using 4 workers but here we need to store results in the order requested
   * var SRA = new SRACrypto(4);
   *
   * //generate 52 quadraric residues (e.g. as plaintext identifiers for a card deck)
   * var cards = new Array();
   * for (var count = 0; count < 25; count++) {
   *    //primeVal was pre-generated in a previous step, count is the result index (requestID in result)
   *    SRA.invoke("randomQuadResidues", {prime:primeVal, numValues:1}, count).then(event =>
   *    {
   *        cards[event.data.requestID] = event.data.result;
   *        for (var count2 = startNum; count2 < cards.length; count2++) {
   *          if (isNaN(cards[count2])) {
   *             return;
   *          }
   *        }
   *        //all values accounted for
   *        for (count2 = 0; count2 < cards.length; count2++) {
   *           //we could include additional information from an exteral source
   *           //here (e.g. card names, values, colours, etc.)
   *           console.log ("Card #" + count2 + ": " + cards[count2]);
   *        }
   *     }
   *  });
   * }
   *
   * @example
   * //similar to the example above but using a promise to resolve ordered results
   * var SRA = new SRACrypto(4);
   *
   * //encrypt 52 "cards" (quadratic residues) with a given keypair
   * function doEncrypt(cards, keypairObject) {
   *     var promise = new Promise((resolve, reject) => {
   *       var encCards = new Array(cards.length);
   *       for (var count=0; count < cards.length; count++) {
   *         SRA.invoke("encrypt", {value: cards[count], keypair: keypairObject}, count).then(event =>
   *         {
   *            encCards[event.data.requestID] = event.data.result;
   *            for (var count2 = startNum; count2 < decCards.length; count2++) {
   *              if (isNaN(ordereredResults[count2])) {
   *                 return;
   *              }
   *            }
   *            //promise is resolved only when all cards have been stored
   *            resolve (encCards);
   *          });
   *        }
   *    });
   *    return (promise);
   * }
   *
   * //cards and keypair were pre-generated in a previous step
   * doEncrypt(cards, keypair).then(encCards => {
   *  for (var count=0; count < encCards.length; count++ )
   *    console.log ("Card #"+count+" "+cards[count]+" encrypted to "+encCards[count]);
   *  }
   * })
   *
   * @example
   * //using an intermediate async function to perform similar functionality as above
   * var SRA = new SRACrypto(4);
   *
   * //decrypt a deck of single-encrypted cards
   * function doDecrypt(encCards, keypair) {
   *   var promise = new Promise((resolve, reject) => {
   *      var decCards = new Array(encCards.length);
   *      for (var count=0; count < encCards.length; count++) {
   *         SRA.invoke("decrypt", {value:encCards[count], keypair:keypair}, count).then(event =>
   *         {
   *            decCards[event.data.requestID] = event.data.result;
   *            for (var count2 = startNum; count2 < decCards.length; count2++) {
   *               if (isNaN(ordereredResults[count2])) {
   *                  return;
   *               }
   *            }
   *            resolve (ordereredResults);
   *         }
   *      });
   *     }
   *   });
   *   return (promise);
   * }
   *
   * async function decryptAsync(encryptedCardsArray, encryptingKeypairObject) {
   *  var decCards = await doDecrypt(encryptedCardsArray, encryptingKeypairObject);
   *  for (var count=0; count<decCards.length; count++) {
   *    console.log ("Card #"+count+" "+encryptedCardsArray[count]+" decypted to "+decCards[count]);
   *  }
   * }
   *
   * //encCards and keypair were pre-generated in a previous step
   * decryptAsync(encCards, keypair);
   *
   * @example
   * var SRA = new SRACrypto(4);
   * //a smaller async example of the above, this time using Promises.all to
   * //resolve the queued results but still using requestIDs for ordering
   *
   * async function decryptAsync(encCards, keypair) {
   *   var promises = new Array();
   *   for (var count=0; count < encCards.length; count++) {
   *      promises.push(SRA.invoke("decrypt", {value:encCards[count], keypair:keypair}, count));
   *   }
   *   var resultPromises = await Promise.all(promises);
   *   //at this point we know that all promises have been fulfilled
   *   var decCards = new Array(resultPromises.length);
   *   for (var count=0; count < resultPromises.length; count++) {
   *      decCards[resultPromises[count].data.requestID] = resultPromises[count].data.result;
   *   }
   *  return (decCards);
   * }
   *
   * //encCards and keypair were pre-generated in a previous step
   * decryptAsync(encCards, keypair).then(decCards => {
   *    for (var count=0; count<decCards.length; count++) {
   *     console.log ("Card #"+count+" "+encCards[count]+" decypted to "+decCards[count]);
   *    }
   * })
   *
   * @example
   * var SRA = new SRACrypto(4);
   * //an even smaller example of the above without using a requestID
   *
   * var promises = new Array();
   * async function decryptAsync(encCards, keypair) {
   *   var promises = new Array();
   *   for (var count=0; count < encCards.length; count++) {
   *      promises.push(SRA.invoke("decrypt", {value:encCards[count], keypair:keypair}));
   *   }
   *   var resultPromises = await Promise.all(promises);
   *   return (resultPromises);
   * }
   *
   * //encCards and keypair were pre-generated in a previous step
   * decryptAsync(encCards, keypair).then(results => {
   *    for (var count=0; count<results.length; count++) {
   *     console.log ("Card #"+count+" "+encCards[count]+" decrypted to "+results[count].data.result);
   *    }
   * })
   */
   async invoke (method, params, requestID) {
      for (var count = 0; count < SRACrypto.workerHosts.length; count++) {
         var currentHost = SRACrypto.workerHosts[count];
         if (currentHost.ready) {
            return (currentHost.invoke(method, params, requestID));
         }
      }
      //no available hosts at this moment
      var promise = new Promise ((resolve, reject) => {
         var queueObj = new Object();
         queueObj.resolve = resolve;
         queueObj.reject = reject;
         queueObj.method = method;
         queueObj.params = params;
         queueObj.requestID = requestID;
         _queue.push(queueObj);
      });
      return (promise);
   }

   /**
   * Event listener triggered when a {@link WorkerHost} instance reports that it
   * is ready for new requests. The internal queue is automatically adjusted
   * and a new request triggered if there are queued requests.
   */
   async onHostReady (event) {
      //note we use custom "source" property instead of "target" here
      var currentHost = event.source;
      if (_queue.length > 0) {
         var currentQueueItem = _queue.shift();
         var result = await currentHost.invoke(currentQueueItem.method, currentQueueItem.params, currentQueueItem.requestID);
         currentQueueItem.resolve(result);
      }
   }

   /**
   * @property {Array} workerHosts All of the registered {@link WorkerHost} instances
   * being managed by this class instance.
   */
   static get workerHosts () {
      return (_hosts);
   }

   /**
   * @property {Array} requestQueue All currently queued requests being managed by
   * the class instance.
   */
   static get requestQueue () {
      return (_queue);
   }
}

export default SRACrypto;