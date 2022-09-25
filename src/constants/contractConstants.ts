const  nftContractAddress= 'ct_3kP94B8Wq9SBo2DceAg3HEFPZXRuvCp3xzMvyvAgiRfcfNuVm';
const   nftContractSource= `@compiler >= 6

include "List.aes"
include "Option.aes"
include "String.aes"

namespace Utils =
    function bool_to_string(v: bool): string =
        switch (v)
            true => "true"
            false => "false"

contract interface NFTInterface =
    datatype metadata_type = URL | IPFS | OBJECT_ID | MAP
    datatype metadata = MetadataIdentifier(string) | MetadataMap(map(string, string))

    record meta_info = 
        { name: string
        , symbol: string
        , base_url: option(string)
        , metadata_type : metadata_type }

    entrypoint aex141_extensions : () => list(string)


    entrypoint meta_info : () => meta_info

    entrypoint metadata : (int) => option(metadata)

    entrypoint balance : (address) => option(int)

    entrypoint owner : (int) => option(address)

  
    stateful entrypoint transfer : (address, address, int, option(string)) => unit

  
    stateful entrypoint approve : (address, int, bool) => unit

    
    stateful entrypoint approve_all : (address, bool) => unit


    entrypoint get_approved : (int) => option(address)

    entrypoint is_approved : (int, address) => bool

    
    entrypoint is_approved_for_all : (address, address) => bool

contract interface NFTReceiver = 
    entrypoint on_nft_received : (address, address, int, option(string)) => bool


contract NFT =
    
    datatype event 
        = Transfer(address, address, int)
        | Approval(address, address, int, string)
        | ApprovalForAll(address, address, string)

    
    datatype metadata_type = URL | IPFS | OBJECT_ID | MAP
    datatype metadata = MetadataIdentifier(string) | MetadataMap(map(string, string))

    record meta_info = 
        { name: string
        , symbol: string
        , base_url: option(string)
        , metadata_type : metadata_type }
    
    record state = 
        { owner: address
       
        , meta_info: meta_info
        , owners: map(int, address)
        , balances: map(address, int)
        , approvals: map(int, address)
        , operators: map(address, map(address, bool))
        , metadata: map(int, metadata)
        , counter: int }

    
    stateful entrypoint init(name: string, symbol: string, base_url: option(string), metadata_type: metadata_type) = 
        require(String.length(name) >= 1, "STRING_TOO_SHORT_NAME")
        require(String.length(symbol) >= 1, "STRING_TOO_SHORT_SYMBOL")

        { owner = Call.caller,
        
          meta_info = { name = name, symbol = symbol, base_url = base_url, metadata_type = metadata_type },
          owners = {},
          balances = {},
          approvals = {},
          operators = {},
          metadata = {},
          counter = 0 }

    
    stateful entrypoint mint(owner: address, metadata: option(metadata), data: option(string)) : int =
        require_contract_owner() // In this example only the contract owner can mint. 

        let token_id = state.counter
        switch(metadata)
            None =>
                put( state { counter = state.counter + 1, balances[owner = 0] @ b = b + 1, owners[token_id] = owner } ) 
            Some(v) => 
                put( state { counter = state.counter + 1, balances[owner = 0] @ b = b + 1, owners[token_id] = owner, metadata[token_id] = v } )

        switch(invoke_nft_receiver(Contract.address, owner, 0, data))
           
            (true, false) => abort("SAFE_MINT_FAILED")
            _ => Chain.event(Transfer(Contract.address, owner, token_id))
        
        token_id

   
    entrypoint aex141_extensions() : list(string) =
        ["mintable"]

    // Returns meta information associated with the token contract.
    entrypoint meta_info() : meta_info = 
        state.meta_info

    // Returns meta data associated with a token. 
    entrypoint metadata(token_id: int) : option(metadata) = 
        switch(Map.lookup(token_id, state.metadata))
            None => None
            Some(v) =>
                if(state.meta_info.metadata_type == URL)
                  
                    switch(state.meta_info.base_url)
                        None =>
                            Some(v)
                        Some(base_url) =>
                            switch(v)
                                MetadataIdentifier(s) =>
                                    Some(MetadataIdentifier(String.concats([base_url, s])))
                else
                    // Not an URL, so return the metadata as it is.
                    Some(v)

    
    entrypoint balance(owner: address) : option(int) =
        Map.lookup(owner, state.balances)

    entrypoint owner(token_id: int) : option(address) =
        Map.lookup(token_id, state.owners)

    
    stateful entrypoint transfer(from: address, to: address, token_id: int, data: option(string)) : unit =
        require_authorized(token_id)
        require_token_owner(token_id, from)
        
        remove_approval(token_id)
        put( state { balances[from] @b = b - 1, balances[to = 0] @nb = nb + 1, owners[token_id] = to } )
        switch(invoke_nft_receiver(from, to, token_id, data))
            // to address is a contract and invocation failed.
            (true, false) => abort("SAFE_TRANSFER_FAILED")
            _ => Chain.event(Transfer(from, to, token_id))

    
    stateful entrypoint approve(approved: address, token_id: int, enabled: bool) : unit =
        require_authorized(token_id)

        if(enabled)
            put( state { approvals[token_id] = approved })
        else
            remove_approval(token_id)
        Chain.event(Approval(state.owners[token_id], approved, token_id, Utils.bool_to_string(enabled)))


   
    stateful entrypoint approve_all(operator: address, enabled: bool) : unit =
        put( state { operators = { [Call.caller] = { [operator] = enabled }} } )
        Chain.event(ApprovalForAll(Call.caller, operator, Utils.bool_to_string(enabled)))

    entrypoint get_approved(token_id: int) : option(address) =
        Map.lookup(token_id, state.approvals)

    // Returns true if a is approved to transact for the token.
    entrypoint is_approved(token_id: int, a: address) : bool =
        switch(Map.lookup(token_id, state.approvals))
            None => false
            Some(o) => o == a

    entrypoint is_approved_for_all(owner: address, operator: address) : bool =
        switch(Map.lookup(owner, state.operators))
            None => false
            Some(ops) =>
                switch(Map.lookup(operator, ops))
                    None => false
                    Some(v) => v

    // Helper functions

    // Returns true if a is the owner of the token with token_id.
    private function is_token_owner(token_id: int, a: address) : bool =
        switch(Map.lookup(token_id, state.owners))
            None => false
            Some(o) => o == a

    private function require_contract_owner() : unit =
        require(Call.caller == state.owner, "ONLY_CONTRACT_OWNER_CALL_ALLOWED")


    private function require_token_owner(token_id: int, a: address) : unit =
        require(is_token_owner(token_id, a), "ONLY_OWNER_CALL_ALLOWED")

  
    private function require_token_owner_or_operator(token_id: int) : unit =
        let owner = switch(owner(token_id))
            None => abort("INVALID_TOKEN_ID")
            Some(v) => v
        require(Call.caller == owner || is_approved_for_all(owner, Call.caller), "ONLY_OWNER_OR_OPERATOR_CALL_ALLOWED")

    
    private function require_authorized(token_id: int) : unit =
        let owner = switch(owner(token_id))
            None => abort("INVALID_TOKEN_ID")
            Some(v) => v
        require(Call.caller == owner || is_approved(token_id, Call.caller) || is_approved_for_all(owner, Call.caller), "ONLY_OWNER_APPROVED_OR_OPERATOR_CALL_ALLOWED")

    // Helper function to remove an approval from the map.
    private stateful function remove_approval(token_id: int) : unit =
        if(Map.member(token_id, state.approvals))
            put( state { approvals = Map.delete(token_id, state.approvals)})
    
    // Helper function for safe transfers.
    // Returns a pair of bool (is_contract, success).
    private function invoke_nft_receiver(from: address, to: address, token_id: int, data: option(string)) : (bool * bool) =
        if(Address.is_contract(to))
            let c = Address.to_contract(to)

            // Try to invoke on_nft_received. 
            switch(c.on_nft_received(from, to, token_id, data, protected = true) : option(bool))
                None => (true, false)       // The contract doesn't implement on_nft_received
                Some(val) => (true, val)
        else
            // The address is NOT a contract.
            (false, false)`;

    const marketContractAddress= 'ct_M9oBYc9X4pkLhpTiLL74hjVpJRpGyrnogubr8Br9eLg8g2qim';
    const marketContractSource= `
     @compiler >= 6
     
     include "String.aes"
     
     
     
     
     contract interface NFTInterface =
         datatype metadata_type = URL | IPFS | OBJECT_ID | MAP
         datatype metadata = MetadataIdentifier(string) | MetadataMap(map(string, string))
     
         record meta_info = 
             { name: string
             , symbol: string
             , base_url: option(string)
             , metadata_type : metadata_type }
     
       
         entrypoint aex141_extensions : () => list(string)
     
         // Returns meta information associated with the contract.
         entrypoint meta_info : () => meta_info
     
         
         entrypoint metadata : (int) => option(metadata)
     
     
         entrypoint balance : (address) => option(int)
     
         entrypoint owner : (int) => option(address)
       
         stateful entrypoint transfer : (address, address, int, option(string)) => unit
     
         stateful entrypoint approve : (address, int, bool) => unit
     
         stateful entrypoint approve_all : (address, bool) => unit
     
       
         entrypoint get_approved : (int) => option(address)
     
         // Returns true if approved is approved to transact for token.
         entrypoint is_approved : (int, address) => bool
     
         entrypoint is_approved_for_all : (address, address) => bool
     
     
     
     contract NFTMarket =
         
         // Declaration and structure of datatype event
         // and events that will be emitted on changes
         datatype event = MarketItemCreated(int, address, address)
     
         record marketItem = {
             marketItemId : int,
             nftContractAddress : NFTInterface,
             tokenId : int,
             creator: address,
             seller : address, //person selling the nft
             owner : address, //owner of the nft
             price : int,
             sold : bool,
             canceled : bool
          }
           
         record state = {
             nftContractAddress : NFTInterface,
             totalItem : int, 
             owner : address,
             deployer: address,
             marketItems : map(int, marketItem),//a way to access values of the MarketItem struct above by passing an integer ID
             listingFee : int,
             marketItemIds : int,
             tokensSold : int,
             tokensCanceled : int
          }
         
         stateful entrypoint init(_nftAddress: NFTInterface) = {
             nftContractAddress = _nftAddress,
             totalItem = 0,
             owner = Call.caller,
             deployer = Call.caller,
             marketItems = {},
             listingFee = 1,
             marketItemIds = 0,
             tokensSold = 0,
             tokensCanceled = 0
          }
     
         payable stateful entrypoint createMarketItem (_nftAddress: NFTInterface,_tokenId : int, _price : int) : int =
             require(_price > 0, "Price must be at least 1 Ae")
             require(Call.value == state.listingFee, "Price must be equal to listing price")
             let i : int = getTotalMarketItemIds() + 1
             let itemCount : int = getTotalItem() + 1
     
     
     
             let _creator = switch(_nftAddress.owner(_tokenId))
                 None => abort("INVALID_TOKEN_ID")
                 Some(v) => v
     
             let _marketItem = {
                 marketItemId = itemCount,
                 nftContractAddress = _nftAddress,
                 tokenId  = _tokenId,
                 creator = _creator,
                 seller = Call.caller, //person selling the nft
                 owner = _creator, //owner of the nft
                 price = _price,
                 sold = false,
                 canceled = false
              }
     
             put(state{marketItems[itemCount] = _marketItem ,marketItemIds = i, totalItem = itemCount})
             itemCount
     
              
     
     /**
          * @dev Creates a market sale by transfering msg.sender money to the seller and NFT token from the
          * marketplace to the msg.sender. It also sends the listingFee to the marketplace owner.
          */
         payable stateful entrypoint createMarketSale(_nftContractAddress:NFTInterface, _marketItemId:int) =
             let market = getMarketItem(_marketItemId)
             let price:int = market.price
             let tokenId:int = market.tokenId
             let tokenSold:int = getTotalTokensSold() +1
             require(Call.value == price, "Please submit the asking price in order to continue")
     
             put(state{marketItems[_marketItemId].owner = Call.caller,marketItems[_marketItemId].sold = true, tokensSold = tokenSold})
            
             Chain.spend(market.seller,Call.value)
             Chain.spend(market.owner,state.listingFee)
             _nftContractAddress.transfer(market.seller,Call.caller,tokenId,None)
          
         
     
         entrypoint getMarketItem(_marketItemId : int): marketItem =
             switch(Map.lookup(_marketItemId, state.marketItems))
                None => abort("There was no market item Found")
                Some(x) => x
     
         entrypoint getNFTMetaInfo() =
              state.nftContractAddress.meta_info()
            
          /// @notice function to get listingprice
         entrypoint getListingFee() : int =
              state.listingFee
         
         stateful entrypoint setListingFee(_fee : int) : int = 
             if(Call.caller == state.owner)
              put(state {listingFee = _fee})
              _fee
             else
               state.listingFee
           
         entrypoint getTotalItem() : int =
              state.totalItem
         
         entrypoint getTotalMarketItemIds() : int =
              state.marketItemIds
         
         entrypoint getTotalTokensSold() : int =
              state.tokensSold
     
         entrypoint getTotalTokensCanceled() : int =
              state.tokensCanceled 
     `;

export {
    nftContractAddress,nftContractSource,marketContractAddress,marketContractSource
}