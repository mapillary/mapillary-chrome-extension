var fetch = require('node-fetch');

var getLocation = function(key) {
    var clientId = 'd3IyLTM1bGNFRkIyR0xVY3NJOG1idzpmNTc5ZDRhNjkyYzZjNjdk',
        mapillaryApiUrl = 'https://a.mapillary.com/v3/images/';

    return fetch(mapillaryApiUrl + key + '?client_id=' + clientId)
        .then(function(response) {
            return response.json();
        });
}

var locations = [
    "mzxQwrbkTVc5PNva6hkRvw","YYuI0FpkY8WXdV-z26wbzg","cuP9ZR78BXYJBCvu2wQFOA",
    "t09TJfYU3H86zyfkbc8wYw","gufn_J_qdw4S1GZwn4YBIw","rPyl2zkJ_hJS9YVYIb7Mwg",
    "ztQBs95gqgLDZd8vTu5rLg","V9L328QFpkkcDdebBstDlA","cLo_TNYjFEgCGuSdwCN4_A",
    "aWm9EHxDZNsn-fGXhz2OGg","ftwQvrwmCbu6qJIcuVB2Rw","uHrvIRJwHgKRpTJvTDlUXw",
    "qRzcMuhVpqaryFoUgxDkCg","QJthjbNWubE2srS5En-3Ng","kIoeAyrwfCpta1yPM3RXAg",
    "WfeT9yLWDzqCB56vLyFWjA","Uy8qX_N1lx040NWC0t06Vw","Da4_KZ_Qa_ww7000GGC24w",
    "LgEESIPwUzgj39wNisrN0g","GutIEXcm14M2QlnFYz76LQ","Y8UZybi4j8Op1tTk4xES7w",
    "m77CtYhbFnRUXxgZsaMpKA","KIRtFMWhxdDhqAtjZolUGA","ou2v9TWAvTQTwRzBKtfElg",
    "yugmB2ajW-NGbtJh5UuczQ","w7ZYXPNnwNKrwnbKNmLOcQ","dpqSfDAmWTlCTgABj8EgJA",
    "ZWK7csCA-JKPsUwKs5jMDQ","qB2tgnyuXKtZu1FhGJMMpg","jCToFO93PpUKezFTtb-Rlw",
    "jLCqcuGBBPWCEZ0ZnePaNQ","-47bY3i_u_fQF4pKFZD2nw","Qim7atJp2xB0vJ9HdQbSNg",
    "qhht2gfPIBsWMUURhupDkQ","7p5c83ew_ADr1Wu2a90xkQ","W5hRMr5iyQMMSQXrLM1ASg",
    "4NNXhCuXeywgy-xP3Gyeuw","SS2cF5-MQ3JJRNr-pT44bg","rowZ0XyU4ss1sqkQCJktBQ",
    "s8_2z3Udt9vTRBWa1MHStQ","Drd7cNGbOvXWM6KFCEfsJA","s1jYIpOm-kDKTegAJ0nCcA",
    "qxtJLsehU8LqtOZsxMguOA","Hk38fR7KoAIhpzM1poFaLg","b9_wcc5fcC1fYzoWSHFjrA",
    "YfuPBxeNaMxezm_520UiNA","JcUrqta_MqdI8urHZxq3qA","faupZh9GnUT6ngV10hyXEA",
    "UlzSN7r4EWVR91FE_5Wywg","Oh6_i8LeQ9pT_SjXY_CBWw","seDSjpohOKoktXloflcXKw",
    "MRSuTmj39l1ujIkwJhnlag","_vXXqJhvPKbhyMCDyFsA3Q","UEkv-mxpeyHXWQiTElsYIA",
    "iNFsXp6FfupDZCkYgt-7pQ","VvwirfM2No6yc7sB2HTanw","vVXBVMcOL-Rp1GrE_WwIZQ",
    "3bUka7vgDU5y_23tr7hr-g","v6F8iX3emRlp2kcPBP14vw","YU9H1VIwu9tX0PLfpIGuWA",
    "B1rzbbLwQGyIyYF1-OAeZg","H8hDF6WctuD6cSiqDYBebg","IuwlzYdWouFfkreNgvZsTQ",
    "6DXFxhRj61WR5kyXb-HbvQ","3rEz79wF_JiafTLQgvjIgg",
    "kxY0-7ZNIKa6ykwbmUAoiw","JBBVel25Fsc4B_g0mzap_A","1jf-LnGYoesdFki5m-9P4g",
    "458vGqooNlpotTHx8QFbLA","LIzrnu-SdidrQbjgSx9e0g","UoFw9SLDSlK-8_T7H_32bQ",
    "-fvpqsuIsRG4M0NKl0_v5g","g7v04yCOq_Sxsi5pQyVRUA",
    "ccr46O4B9Bd8cmV2LLrF0Q","52OHSaSPlaTt5ZHtAbUJtQ","5ZE3dPlVrkqfmndsLI7rpg",
    "wMAcVLOznLT8IfYsjiAS7A","tYFS0tSaBYKzSidc4sZFQw","Ww85JN5zDq-8AE7DRKvukg",
    "abEOC14e3h4JVaaAf-a2eA","4-WCSGPKPUakXGUqTc3sng","9g3b5LdL3MrdNUBrwIlbng",
    "wsy1tm-FwFchSRNn0VzgKg","xD_savuFjA6ASEGroHwUcA","yhdKhpwnAT9LeGkB1aFjcw",
    "_twv_Di26FVXquJ93buG7A","sOOru5bDJXzh1cHNOAkQfw","KhYr7KYagQNAVRduYDNeew",
    "Y01-Q103nM-AGxcDJMmj8A","gq6Vx19Ji4f7_-yOWNV8rQ","iyJWhRob1sctA2srOEqrRw",
    "3QDRzbw-TXIye4S0xUG1ug","lMiVkz3G412lsdSB2KuZXA",
    "P2nXoSKJuppWgq5XMMu7qw"
];

console.log('Starting download, ' + locations.length + ' images.');
var savedLocations = [];
for (var location of locations) {
    getLocation(location).then(function(response) {
        savedLocations.push(response.properties);
        console.log('Downloaded ' + savedLocations.length);
        if (savedLocations.length === locations.length) {
            console.log(JSON.stringify(savedLocations));
        }
    })
}
