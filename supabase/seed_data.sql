-- Seed data for ClientFlow app: customers, orders, replies, broadcasts
-- Run in Supabase -> SQL Editor -> New query

-- Customers
INSERT INTO customers (id, name, phone, tag, notes, created_at)
VALUES
('c1', 'Chidera Okafor', '08012345678', 'VIP', 'Loves the premium package', now() - interval '5 days')
,('c2', 'Fatima Bello', '07034567890', 'Returning', 'Prefers delivery on weekdays', now() - interval '3 days')
,('c3', 'Emeka Adeyemi', '09011122334', 'New', '', now() - interval '1 day')
,('c4', 'Ngozi Williams', '08098765432', 'VIP', 'Referred 3 customers', now() - interval '10 days')
ON CONFLICT (id) DO NOTHING;

-- Orders
INSERT INTO orders (id, customer_id, item, amount, status, created_at)
VALUES
('o1', 'c1', 'Custom Logo Design', 25000, 'Delivered', now() - interval '4 days')
,('o2', 'c2', 'Brand Identity Package', 80000, 'Paid', now() - interval '2 days')
,('o3', 'c3', 'Social Media Flyers (5)', 15000, 'Pending', now() - interval '1 day')
,('o4', 'c4', 'Business Card Design', 8000, 'Pending', now())
,('o5', 'c2', 'Flyer Redesign', 6000, 'Delivered', now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- Replies (quick replies)
INSERT INTO replies (id, title, message, created_at)
VALUES
('r1', 'Greeting', 'Hello! 👋 Welcome to our store. How can I help you today?', now() - interval '10 days')
,('r2', 'Order Confirmation', 'Great choice! ✅ I\'ve received your order and will start working on it shortly. I\'ll keep you updated.', now() - interval '9 days')
,('r3', 'Payment Reminder', 'Hi! Just a friendly reminder that payment for your order is due. Kindly send to [Account Details]. Thank you! 🙏', now() - interval '8 days')
,('r4', 'Order Ready', 'Great news! 🎉 Your order is ready. Kindly confirm your delivery details so we can arrange pickup/delivery.', now() - interval '7 days')
,('r5', 'Thank You', 'Thank you for your business! 🙌 We really appreciate it. Don\'t forget to refer us to your friends and family.', now() - interval '6 days')
ON CONFLICT (id) DO NOTHING;

-- Broadcasts (example)
INSERT INTO broadcasts (id, audience, message, metadata, sent_at, created_at)
VALUES
('b1', '{"tags": ["VIP"]}', 'We\'re offering a VIP discount this weekend! Reply to claim.', '{"sent_via": "email"}', now() - interval '2 days', now() - interval '2 days')
ON CONFLICT (id) DO NOTHING;

-- Done.
