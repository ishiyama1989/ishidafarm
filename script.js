// カート機能
let cart = [];
let cartTotal = 0;

// 商品データ
const products = {
    '桃': { name: '桃', price: 2800, unit: '1kg' },
    'ぶどう': { name: 'ぶどう', price: 3200, unit: '1房' },
    'すもも': { name: 'すもも', price: 2400, unit: '1kg' }
};

// カートに商品を追加
function addToCart(productName) {
    const product = products[productName];
    if (!product) return;

    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: product.price,
            unit: product.unit,
            quantity: 1
        });
    }

    updateCartDisplay();
    updateCartTotal();
}

// カートの表示を更新
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>¥${item.price.toLocaleString()} / ${item.unit}</small>
            </div>
            <div>
                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>
                <button onclick="removeFromCart(${index})" style="margin-left: 10px; color: red;">削除</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
}

// 数量変更
function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartDisplay();
    updateCartTotal();
}

// カートから商品を削除
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
    updateCartTotal();
}

// カートの合計を更新
function updateCartTotal() {
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartTotalElement) return;
    
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotalElement.textContent = cartTotal.toLocaleString();
}

// チェックアウト処理
function checkout() {
    if (cart.length === 0) {
        alert('カートが空です。商品を追加してください。');
        return;
    }

    let orderDetails = '注文内容:\n\n';
    cart.forEach(item => {
        orderDetails += `${item.name} × ${item.quantity} (¥${item.price.toLocaleString()} / ${item.unit})\n`;
    });
    orderDetails += `\n合計: ¥${cartTotal.toLocaleString()}`;

    alert(orderDetails + '\n\nお問い合わせフォームから注文を確定してください。');
    
    // お問い合わせフォームにスクロール
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ブログ記事の詳細表示（モーダル風）
function showBlogPost(title, content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;

    modalContent.innerHTML = `
        <button onclick="this.parentElement.parentElement.remove()" style="position: absolute; top: 10px; right: 15px; background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
        <h2>${title}</h2>
        <p>${content}</p>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    // モーダル外クリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(244, 241, 235, 0.95)';
    } else {
        header.style.backgroundColor = '#f4f1eb';
    }
});

// Form submission handler
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    // Get form data
    const formData = new FormData(this);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Simple validation
    if (!data.name || !data.email || !data.message) {
        e.preventDefault();
        alert('必須項目を入力してください。');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        e.preventDefault();
        alert('正しいメールアドレスを入力してください。');
        return;
    }
    
    // メールアプリを開く前に確認
    alert('メールアプリが開きます。お問い合わせありがとうございます。');
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav-list');
    nav.classList.toggle('mobile-active');
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for fade-in animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Image lazy loading fallback
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.style.backgroundColor = '#f0f0f0';
            this.style.display = 'flex';
            this.style.alignItems = 'center';
            this.style.justifyContent = 'center';
            this.innerHTML = '<span style="color: #666;">画像を読み込めませんでした</span>';
        });
    });

    // カートボタンのイベントリスナー
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.parentElement.querySelector('h3').textContent;
            addToCart(productName);
        });
    });

    // チェックアウトボタンのイベントリスナー
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }

    // ブログ記事の「続きを読む」リンクにイベントを追加
    document.querySelectorAll('.read-more').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const title = this.parentElement.querySelector('h3').textContent;
            const content = "こちらは記事の詳細内容です。実際のブログシステムでは、データベースから記事の全文を取得して表示します。現在の記事では、農場での日々の作業や季節の変化、栽培のこだわりなどを詳しく紹介しています。";
            showBlogPost(title, content);
        });
    });
});