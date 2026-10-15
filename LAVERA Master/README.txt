
نظام المخزون الحقيقي:
- كمية كل مقاس/لون محفوظة في Firestore داخل variants[].qty.
- عند إضافة المنتج من لوحة التحكم، قيمة qty التي يدخلها الـ Admin هي الكمية المتاحة فعليًا.
- صفحة المنتج تقرأ المخزون الحالي مباشرة من Firestore، وتمنع Add to Cart عندما تكون الكمية 0.
- زر + في صفحة المنتج لا يسمح بتجاوز المخزون الحالي.
- قبل إنشاء الطلب يتم فحص المخزون مرة أخرى.
- Firestore client-side Firestore transaction تنفذ خصم المخزون داخل Firestore Transaction، لذلك إذا كانت الكمية 10 وتم شراء 1 تصبح 9، وإذا حاول عميلان الشراء في نفس الوقت لا يمكن أن ينخفض المخزون تحت الصفر.
- عند إلغاء الطلب من لوحة التحكم يتم إرجاع الكمية إلى المخزون.
- صفحة Shop تعرض أيضًا حالة المخزون الإجمالي للمنتج.

LAVERA — Final stock-safe build

Stock behavior:
- Admin adds variant quantity directly in products/{id}.variants[].qty.
- Customers see the live quantity for the selected color/size.
- Add to Bag is disabled when the selected variant reaches 0.
- A successful order atomically decrements the real variant qty through the Firebase Firestore `client-side Firestore transaction`.
- Concurrent orders cannot both consume the same last units.
- Cancelling an order from Admin restores its quantities; reactivating a cancelled order checks stock and subtracts again.

Deployment:
1) In the project root run: firebase login
2) Run: firebase deploy --only functions,firestore
3) Keep the existing Firebase web config in js/firebase.js.

Client-facing error messages never expose Firebase/Firestore details.
The messages collection remains for the site's Contact Us feature and is not shown as a technical error to customers.


Production note: This build intentionally does not use Firebase Cloud Functions. Checkout uses Firestore transactions and Security Rules.


V11 FIX: Large base64 product images are no longer copied into Firestore order documents. This prevents the Firestore 1 MiB order-document limit from breaking payment/order submission.


V12 NOTIFICATIONS: Dashboard uses Firestore realtime listeners for new orders/messages/reviews. A professional admin bell plays for new incoming activity. The Overview notification center is inventory-only. A stock alarm plays when product stock crosses into low stock (<=5 total) or reaches zero. No Cloud Functions.
