const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
const ec = new EC('secp256k1');

class frontEndWallet {
  constructor(pub, priv) {
    // the key pair should be optional argument
    if(!(pub && priv)) {
      this.keyPair = ec.genKeyPair();
      this.publicKey = this.keyPair.getPublic().encode('hex');
    } else {
      this.keyPair = ec.keyFromPrivate(priv, 'hex');
      this.publicKey = pub;
    }
  }

  getSecret() {
    return JSON.stringify({
        priv: this.keyPair.getPublic().encode('hex'),
        pub: this.keyPair.getPrivate('hex')
    });
  }

  toString() {
     return `Wallet -
      publicKey: ${this.publicKey.toString()}`;
  }
}

function quickDownload(content, filename) {
  var elemLink = document.createElement('a');
  elemLink.download = filename;
  elemLink.style.display = 'none';

  var blob = new Blob([ content ]);
  elemLink.href = URL.createObjectURL(blob);
  document.body.appendChild(elemLink);
  elemLink.click();
  document.body.removeChild(elemLink);
}

function handleFileSelect(event) {
  let file = event.target.files[0];
  let reader = new FileReader();
  reader.onload = function(e) {
    keyPair = JSON.parse(e.target.result);
    let wallet = new frontEndWallet(keyPair.pub, keyPair.priv);
    console.log(wallet.toString());
  };
  reader.readAsText(file);
}

function handleFileDropOn(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  // files is a FileList of File objects. List some properties.
  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate.toLocaleDateString(), '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}

function handleDragOver(event) {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

document.getElementById('files').addEventListener('change', handleFileSelect, false);


// Setup the dnd listeners.
var dropZone = document.getElementById('drop_zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileDropOn, false);

const wallet = new frontEndWallet();
// quickDownload(wallet.getSecret(), 'key.json');


// var wallet = new Wallet();

// console.log(wallet.toString());

// var msgHash = 'hello world';

// var key0 = ec.keyFromPrivate(wallet.privateKey, 'hex');

// signature = key0.sign(msgHash);

// var key1 = ec.keyFromPublic(wallet.publicKey, 'hex');

// console.log(key1.verify(msgHash, signature));
