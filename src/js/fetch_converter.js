export function fetchConverter() {
    const url = `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`;
    return fetch(url)
        .then(response =>{
            if(!response.ok){
                throw new Error(response.status);;
            }
            return response.json();
    });
}

export function fetchConverterDate(date) {
    const url = `https://api.privatbank.ua/p24api/exchange_rates?date=${date}`;
    return fetch(url)
        .then(response =>{
            if(!response.ok){
                throw new Error(response.status);
            }
            return response.json();
    });
}

