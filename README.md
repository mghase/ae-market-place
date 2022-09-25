# ae-market-place

This repository will guide you through all the steps required to create an NFT MARKETPLACE AND NFT collection and mint unique NFTs on the æternity blockchain using the [AEX-141](https://github.com/aeternity/AEXs/blob/master/AEXS/aex-141.md) standard.

## Extensions

The example demonstrates the usage of following extensions:
- `mintable`

It is planned to introduce a new extension `mapped_metadata` which reflects this example and defines how to deal with collection specific metadata.

## Dealing with metadata

In the [AEX-141](https://github.com/aeternity/AEXs/blob/master/AEXS/aex-141.md) standard we aimed to be very flexible when it comes to dealing with metadata.


## Example collection: ae market for ox into the Metaverse

For this example we used [DALL-E 2](https://openai.com/dall-e-2) to generate some images based on the text 

The images have been uploaded and pinned using [Pinata](https://www.pinata.cloud) where you can pin up to 1GB of media for free.

The NFT images of the example collection are stored under [nfts/images](./nfts/images) and their filename reflect the IPFS hash which is used in the `media_url` of each NFT ;-)

**Note**:

- When creating NFT collections you (or your community) should ensure that the media is always pinned on IPFS (or other decentralized storage alternatives) either by yourself or by some 3rd party service you typicall have to pay for.
- The good thing is that the IPFS hash will always be the same as long as somebody owning the original media has it stored somewhere, uploads and pins at again on IPFS.
- The bad news is that if the media isn't pinned anymore and nobody saved the original file the NFT media cannot be fetched anymore.

## Deployment & Minting

With the following step deploying scripts you can easily test deployment on the official testnet. For mainnet almost identical steps can be executed. Of course you need some Æ to cover the transaction fees.

### Create keypair and get some Æ on testnet
Check out the quick start guide to learn how to create a keypair and how to fund your account:

- https://docs.aeternity.com/aepp-sdk-js/latest/quick-start/

Alternatively just execute the [create_keypair_and_fund_account.js](./deploy/create_keypair_and_fund_account.js) script as follows:

`node ./deploy/create_keypair_and_fund_account.js`

It will print the following output to the console:

```
Secret key: ......... ;-)
Public key: ak_tbTs4c6akzcdqg5f9fRHUvUrww7Z93QPopQ168Dw56u4g26gz
Balance: 5000000000000000000 ættos
```

### Deploy & Mint :-)
The [deploy_and_mint.js](./deploy/deploy_and_mint.js) script demonstrates how you can use the SDK programmatically to deploy and mint your NFTs on the testnet. If you run the following command, the contract will be deployed and the NFTs will be minted according to the data defined in [collection_metadata.json](./nfts/collection_metadata.json):

`SECRET_KEY=<your_secret_key> node ./deploy/deploy_and_mint.js`

Alternatively you can set the env variable `SECRET_KEY` in your terminal and just run `node ./deploy/deploy_and_mint.js`.

The output then should look as follows:

```
Deploying with account: ak_tbTs4c6akzcdqg5f9fRHUvUrww7Z93QPopQ168Dw56u4g26gz
Pass: 1
Pass: 2
Pass: 3
Pass: 4
Pass: 5
Pass: 5.1
Pass: 6
Pass: 7
NFT Contract successfully deployed!
NFT Contract address: ct_2J3J4vtmPBwmBZAKtJRXPENSdpcQVXZpjrYdT1n1BQdozGMYsZ
Tx-Hash: th_2baubqFH2V8B4CJnmkaduUUNsazA5FA1sDMEh86d2UPNzQukCw
Gas used: 999
------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------
MARKET Contract successfully deployed!
MARKET Contract address: ct_NVQuQdprUkuj1ghnFeeUbqtjr6kURRyM5rrQXM58g5JM3u4nG
Tx-Hash: th_XzjFfuHA8SyLGAVUm5QeXSeWZEmpcdHfshjyi3s5eamFQfghu
Gas used: 818
--------------------end market----------------------------------------------------------------------
Minted 'Crypto Raptors' with id '0'
Tx-Hash: th_6pNMYFqpu2z8BqibgQa22nQQwVyDyVNzvddyMbC6NjaRtpg9H
Gas used: 14594
------------------------------------------------------------------------------------------
---------------------create  market items ---------------------------------------------------------------------
Pass: 8
ITEM CREATED  with id '1'
Pass: 9 [object Object]
Minted 'The path to heaven' with id '1'
Tx-Hash: th_eoAZ9W3Lp1ZznmzczMjPLLsLjk195WHvkLF7CfrBnTvHE1gLN
Gas used: 14752
------------------------------------------------------------------------------------------
---------------------create  market items ---------------------------------------------------------------------
Pass: 8
ITEM CREATED  with id '2'
Pass: 9 [object Object]
Minted 'Still sitting in the jungle' with id '2'
Tx-Hash: th_qwEHNRcrEgix9PWPsusVf5bCGmnvYBmZG9AthBg8TWicLrCj7
Gas used: 15062
------------------------------------------------------------------------------------------
---------------------create  market items ---------------------------------------------------------------------
Pass: 8
ITEM CREATED  with id '3'
Pass: 9 [object Object]
Minted 'We almost made it!' with id '3'
Tx-Hash: th_2XBpxnCitsRWSuEsnwhqwgwxeLfKwMprRek6hccepfu8pt7NMZ
Gas used: 14687
------------------------------------------------------------------------------------------
---------------------create  market items ---------------------------------------------------------------------
Pass: 8
ITEM CREATED  with id '4'
Pass: 9 [object Object]
Minted 'I'm in!' with id '4'
Tx-Hash: th_2DJ3zzt2oPgN7eckwEP9uUQ3z5H7UUXaPzeBcRRnYJakWWeuy1
Gas used: 14684
------------------------------------------------------------------------------------------
---------------------create  market items ---------------------------------------------------------------------
Pass: 8
ITEM CREATED  with id '5'
Pass: 9 [object Object]
Minted 'Utopia is there!' with id '5'
Tx-Hash: th_21cyaaw5aXFcw9qG6swmx8b9dA6PR3cjpmXttashEwgckkuHLR
Gas used: 14857
------------------------------------------------------------------------------------------
---------------------create  market items ---------------------------------------------------------------------
Pass: 8
ITEM CREATED  with id '6'
Pass: 9 [object Object]
Minted 'Waiting for my homies!' with id '6'
Tx-Hash: th_iVh77UqYkFaSKiamp9uKv1QN9KxqPNJZELAwsp6V4zbz4MZL9
Gas used: 14987
------------------------------------------------------------------------------------------
---------------------create  market items ---------------------------------------------------------------------
Pass: 8
ITEM CREATED  with id '7'
Pass: 9 [object Object]
Minted 'There is no way back!' with id '7'
Tx-Hash: th_2c7ocQQzxfJzxw2QW55DqksoLypWKnkrDn6DKprCGnZ1WAt5NW
Gas used: 15074
------------------------------------------------------------------------------------------
---------------------create  market items ---------------------------------------------------------------------
Pass: 8
ITEM CREATED  with id '8'
Pass: 9 [object Object]

```

## Fontend ae-market place comming soon
