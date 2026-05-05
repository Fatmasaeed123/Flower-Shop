// 1. بنادي على 'db' من ملف الإعدادات بتاعك (لاحظي .js في الآخر)
import { db } from '/js/firebase.js';
// 2. بنادي على الأدوات اللي بتخليني أضيف داتا لـ Firestore من سيرفرات جوجل
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// 3. بنمسك الفورم من الـ HTML عن طريق الـ ID اللي إنتِ كتبتيه
const contactForm = document.querySelector('#contactForm'); 

// 4. بنقول للمتصفح: "أول ما فاطمة تدوس على زرار Send Now نفذ الكلام ده"
if(contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // ده بيمنع الصفحة إنها تعمل Refresh عشان الداتا متضيعش

        // 5. بنلم البيانات اللي العميل كتبها في الخانات
        const customerMessage = {
            name: document.querySelector('#name').value,    // بياخد الاسم
            email: document.querySelector('#email').value,  // بياخد الإيميل
            message: document.querySelector('#message').value, // بياخد الرسالة
            createdAt: new Date() // بيسجل وقت الإرسال تلقائياً
        };

        try {
            // 6. السطر السحري اللي بيبعت الداتا لـ Firebase
            // كلمة "messages" دي هي اسم الـ Collection اللي إنتِ عملتيه في الـ Console
            await addDoc(collection(db, "messages"), customerMessage);
            
            alert("تم إرسال رسالتك بنجاح يا فاطمة! ");
            contactForm.reset(); // بيفضي الخانات بعد الإرسال
        } catch (error) {
            // لو حصل أي غلط، هيظهر لك هنا في الـ Console
            console.error("Error adding document: ", error);
            alert("للأسف حصل مشكلة، جربي تاني.");
        }
    });
}