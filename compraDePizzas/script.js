let cart = [];
let modalQT = 1;
let modalKey = 0;

const slt = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//Listagem das pizzas
pizzaJson.map((item, index) =>{
    let pizzaItem = slt('.models .pizza-item').cloneNode(true);
    // modalQT = 1;
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('a').addEventListener('click', (e) =>{
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQT = 1;
        modalKey = key;

        slt('.pizzaBig img').src = pizzaJson[key].img;
        slt('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        slt('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        slt('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        slt('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach( (size, sizeIndex) =>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        });

        slt('.pizzaInfo--qt').innerHTML = modalQT;

        slt('.pizzaWindowArea').style.opacity = 0;
        slt('.pizzaWindowArea').style.display = 'flex';
        setTimeout( () =>{
            slt('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });

    slt('.pizza-area').append(pizzaItem);
});

//eventos do modal
function closeModal() {
    slt('.pizzaWindowArea').style.opacity = 0;
    setTimeout( () => {
        slt('.pizzaWindowArea').style.display = 'none';
    }, 500)
}
cs('.pizzaInfo--cancelButton,.pizzaInfo--cancelMobileButton').forEach( (item)=>{
    item.addEventListener('click', closeModal);
});
slt('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQT > 1){
        modalQT --;
        slt('.pizzaInfo--qt').innerHTML = modalQT;
    }
});
slt('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQT ++;
    slt('.pizzaInfo--qt').innerHTML = modalQT;
});
cs('.pizzaInfo--size').forEach( (size, sizeIndex) =>{
    size.addEventListener('click', (e)=>{
        slt('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
slt('.pizzaInfo--addButton').addEventListener('click', ()=>{   
    let size = parseInt(slt('.pizzaInfo--size.selected').getAttribute('data-key')) ;

    let idetifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=> item.idetifier == idetifier);

    if(key > -1){
        cart[key].qt += modalQT;
    }else{
        cart.push({
            idetifier,
            id:pizzaJson[modalKey].id,
            size,
            qt:modalQT
        });
    }

    updateCart();
    closeModal();
});

slt('.menu-openner').addEventListener('click', () =>{
    if(cart.length > 0){
        slt('aside').style.left = '0';
    }
});
slt('.menu-closer').addEventListener('click', ()=>{
    slt('aside').style.left = '100vw';
});

function updateCart() {
    slt('.menu-openner span').innerHTML = cart.length;

    if(cart.length > 0){
        slt('aside').classList.add('show');
        slt('.cart').innerHTML = '';

        let subTotal  = 0;
        let desconto = 0;
        let notal = 0;

        for(let i in cart){
            let pizzaItem = pizzaJson.find((item) =>item.id == cart[i].id);
            subTotal += pizzaItem.price* cart[i].qt;
            let cartItem = slt('.models .cart--item').cloneNode(true);

            let pizzaSizeName;

            switch(cart[i].size){
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if(cart[i].qt >1){
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qt++;
                updateCart();
            });


            slt('.cart').append(cartItem);
        }

        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        slt('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
        slt('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        slt('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        slt('aside').classList.remove('show');
        slt('aside').style.left = '100vw';
    }
}