import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { addListener } from "../lib/realtimeClient";

const SEED_CUSTOMERS = [];
const SEED_ORDERS = [];
const SEED_REPLIES = [];
const SEED_BROADCASTS = [];

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("localStorage save failed", e);
  }
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useStore() {
  const [user, setUser] = useState(() => load("cf_user", null));
  const [customers, setCustomers] = useState(() =>
    load("cf_customers", SEED_CUSTOMERS),
  );
  const [orders, setOrders] = useState(() => load("cf_orders", SEED_ORDERS));
  const [replies, setReplies] = useState(() =>
    load("cf_replies", SEED_REPLIES),
  );
  const [broadcasts, setBroadcasts] = useState(() =>
    load("cf_broadcasts", SEED_BROADCASTS),
  );
  const [invoices, setInvoices] = useState(() => load("cf_invoices", []));
  const [toasts, setToasts] = useState([]);

  /* ── Persist on change ── */
  useEffect(() => {
    save("cf_user", user);
  }, [user]);
  useEffect(() => {
    save("cf_customers", customers);
  }, [customers]);
  useEffect(() => {
    save("cf_orders", orders);
  }, [orders]);
  useEffect(() => {
    save("cf_replies", replies);
  }, [replies]);
  useEffect(() => {
    save("cf_broadcasts", broadcasts);
  }, [broadcasts]);
  useEffect(() => {
    save("cf_invoices", invoices);
  }, [invoices]);

  /* ── Load from Supabase on session start or user change ── */
  useEffect(() => {
    if (!user?.id) return;
    
    // We only want to sync once per login session to avoid unnecessary traffic,
    // but we must ensure we get at least one fresh fetch.
    async function loadFromSupabase() {
      try {
        const { data: customersData, error: cErr } = await supabase
          .from("customers")
          .select("*");
        if (!cErr && customersData && customersData.length)
          setCustomers(
            customersData.map((c) => ({
              id: c.id,
              name: c.name,
              phone: c.phone,
              tag: c.tag,
              notes: c.notes || "",
              createdAt: c.created_at || c.createdAt,
            })),
          );

        const { data: ordersData, error: oErr } = await supabase
          .from("orders")
          .select("*");
        if (!oErr && ordersData && ordersData.length)
          setOrders(
            ordersData.map((o) => ({
              id: o.id,
              customerId: o.customer_id || o.customerId,
              item: o.item,
              amount: o.amount,
              status: o.status,
              createdAt: o.created_at || o.createdAt,
            })),
          );

        const { data: repliesData, error: rErr } = await supabase
          .from("replies")
          .select("*");
        if (!rErr && repliesData && repliesData.length)
          setReplies(
            repliesData.map((r) => ({
              id: r.id,
              title: r.title,
              message: r.message,
              createdAt: r.created_at || r.createdAt,
            })),
          );

        const { data: broadcastsData } = await supabase
          .from("broadcasts")
          .select("*");
        if (broadcastsData && broadcastsData.length)
          setBroadcasts(
            broadcastsData.map((b) => ({
              id: b.id,
              audience: b.audience,
              message: b.message,
              metadata: b.metadata,
              sentAt: b.sent_at || b.sentAt,
              createdAt: b.created_at || b.createdAt,
            })),
          );

        const { data: invoicesData } = await supabase
          .from("invoices")
          .select("*");
        if (invoicesData && invoicesData.length)
          setInvoices(
            invoicesData.map((i) => ({
              id: i.id,
              orderId: i.order_id,
              customerId: i.customer_id,
              invoiceNumber: i.invoice_number,
              businessName: i.business_name,
              businessPhone: i.business_phone,
              businessEmail: i.business_email,
              items: i.items || [],
              subtotal: i.subtotal,
              discount: i.discount,
              tax: i.tax,
              total: i.total,
              notes: i.notes,
              status: i.status,
              dueDate: i.due_date,
              paidAt: i.paid_at,
              createdAt: i.created_at,
            })),
          );
      } catch (e) {
        console.warn("Supabase load failed", e);
      }
    }
    loadFromSupabase();
  }, [user?.id]);

  /* ── Realtime subscriptions ── */
  useEffect(() => {
    const unsubCustomers = addListener("customers", (payload) => {
      const rec = payload.record;
      const old = payload.old;
      if (payload.eventType === "INSERT") {
        const c = {
          id: rec.id,
          name: rec.name,
          phone: rec.phone,
          tag: rec.tag,
          notes: rec.notes || "",
          createdAt: rec.created_at || rec.createdAt,
        };
        setCustomers((prev) => [c, ...prev.filter((p) => p.id !== c.id)]);
      } else if (payload.eventType === "UPDATE") {
        setCustomers((prev) =>
          prev.map((p) =>
            p.id === rec.id
              ? {
                  ...p,
                  name: rec.name,
                  phone: rec.phone,
                  tag: rec.tag,
                  notes: rec.notes || "",
                  createdAt: rec.created_at || rec.createdAt,
                }
              : p,
          ),
        );
      } else if (payload.eventType === "DELETE") {
        setCustomers((prev) => prev.filter((p) => p.id !== old.id));
      }
    });

    const unsubOrders = addListener("orders", (payload) => {
      const rec = payload.record;
      const old = payload.old;
      if (payload.eventType === "INSERT") {
        const o = {
          id: rec.id,
          customerId: rec.customer_id || rec.customerId,
          item: rec.item,
          amount: rec.amount,
          status: rec.status,
          createdAt: rec.created_at || rec.createdAt,
        };
        setOrders((prev) => [o, ...prev.filter((p) => p.id !== o.id)]);
      } else if (payload.eventType === "UPDATE") {
        setOrders((prev) =>
          prev.map((p) =>
            p.id === rec.id
              ? {
                  ...p,
                  customerId: rec.customer_id || rec.customerId,
                  item: rec.item,
                  amount: rec.amount,
                  status: rec.status,
                  createdAt: rec.created_at || rec.createdAt,
                }
              : p,
          ),
        );
      } else if (payload.eventType === "DELETE") {
        setOrders((prev) => prev.filter((p) => p.id !== old.id));
      }
    });

    const unsubReplies = addListener("replies", (payload) => {
      const rec = payload.record;
      const old = payload.old;
      if (payload.eventType === "INSERT") {
        const r = {
          id: rec.id,
          title: rec.title,
          message: rec.message,
          createdAt: rec.created_at || rec.createdAt,
        };
        setReplies((prev) => [r, ...prev.filter((p) => p.id !== r.id)]);
      } else if (payload.eventType === "UPDATE") {
        setReplies((prev) =>
          prev.map((p) =>
            p.id === rec.id
              ? {
                  ...p,
                  title: rec.title,
                  message: rec.message,
                  createdAt: rec.created_at || rec.createdAt,
                }
              : p,
          ),
        );
      } else if (payload.eventType === "DELETE") {
        setReplies((prev) => prev.filter((p) => p.id !== old.id));
      }
    });

    const unsubBroadcasts = addListener("broadcasts", (payload) => {
      const rec = payload.record;
      const old = payload.old;
      if (payload.eventType === "INSERT") {
        const b = {
          id: rec.id,
          audience: rec.audience,
          message: rec.message,
          metadata: rec.metadata,
          sentAt: rec.sent_at || rec.sentAt,
          createdAt: rec.created_at || rec.createdAt,
        };
        setBroadcasts((prev) => [b, ...prev.filter((p) => p.id !== b.id)]);
      } else if (payload.eventType === "UPDATE") {
        setBroadcasts((prev) =>
          prev.map((p) =>
            p.id === rec.id
              ? {
                  ...p,
                  audience: rec.audience,
                  message: rec.message,
                  metadata: rec.metadata,
                  sentAt: rec.sent_at || rec.sentAt,
                  createdAt: rec.created_at || rec.createdAt,
                }
              : p,
          ),
        );
      } else if (payload.eventType === "DELETE") {
        setBroadcasts((prev) => prev.filter((p) => p.id !== old.id));
      }
    });

    // ── Invoices realtime ──
    const unsubInvoices = addListener("invoices", (payload) => {
      const rec = payload.record;
      const old = payload.old;
      const map = (i) => ({
        id: i.id,
        orderId: i.order_id,
        customerId: i.customer_id,
        invoiceNumber: i.invoice_number,
        businessName: i.business_name,
        businessPhone: i.business_phone,
        businessEmail: i.business_email,
        items: i.items || [],
        subtotal: i.subtotal,
        discount: i.discount,
        tax: i.tax,
        total: i.total,
        notes: i.notes,
        status: i.status,
        dueDate: i.due_date,
        paidAt: i.paid_at,
        createdAt: i.created_at,
      });
      if (payload.eventType === "INSERT")
        setInvoices((prev) => [
          map(rec),
          ...prev.filter((p) => p.id !== rec.id),
        ]);
      else if (payload.eventType === "UPDATE")
        setInvoices((prev) =>
          prev.map((p) => (p.id === rec.id ? { ...p, ...map(rec) } : p)),
        );
      else if (payload.eventType === "DELETE")
        setInvoices((prev) => prev.filter((p) => p.id !== old.id));
    });

    return () => {
      try {
        unsubCustomers?.();
        unsubOrders?.();
        unsubReplies?.();
        unsubBroadcasts?.();
        unsubInvoices?.();
      } catch (e) {
        console.warn("realtime listeners cleanup failed", e);
      }
    };
  }, []);

  /* ── Toasts ── */
  const toast = useCallback((message, type = "success") => {
    const id = uid();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  }, []);

  /* ── Supabase Auth ── */
  useEffect(() => {
    let sub;
    async function init() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data?.session;
        if (session?.user) {
          const u = session.user;
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", u.id)
              .single();
            if (profile)
              setUser({
                id: profile.id,
                name: profile.full_name || profile.email,
                email: profile.email,
                role: profile.role,
              });
            else
              setUser({
                id: u.id,
                email: u.email,
                name: u.email?.split("@")[0],
              });
          } catch {
            setUser({ id: u.id, email: u.email, name: u.email?.split("@")[0] });
          }
        }
      } catch (e) {
        console.warn("Auth init failed", e);
      }

      const res = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const u = session.user;
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", u.id)
              .single();
            if (profile)
              setUser({
                id: profile.id,
                name: profile.full_name || profile.email,
                email: profile.email,
                role: profile.role,
              });
            else
              setUser({
                id: u.id,
                email: u.email,
                name: u.email?.split("@")[0],
              });
          } catch {
            setUser({ id: u.id, email: u.email, name: u.email?.split("@")[0] });
          }
        } else {
          setUser(null);
        }
      });
      sub = res.data?.subscription;
    }
    init();
    return () => {
      try {
        sub?.unsubscribe();
      } catch (err) {
        console.warn(err);
      }
    };
  }, []);

  /* ── Auth actions ── */
  const signIn = useCallback(
    async (email, password) => {
      try {
        const trimmedEmail = typeof email === "string" ? email.trim() : email;
        const trimmedPassword =
          typeof password === "string" ? password.trim() : password;
        if (!trimmedEmail || !trimmedPassword) {
          toast("Please provide email and password", "error");
          return { error: new Error("missing_credentials") };
        }
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPassword,
        });
        if (error) {
          toast(error.message || "Invalid credentials", "error");
          return { error, sessionExists: false };
        }
        const user = data.user ?? data.session?.user;
        if (user) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", user.id)
              .single();
            if (profile)
              setUser({
                id: profile.id,
                name: profile.full_name || profile.email,
                email: profile.email,
                role: profile.role,
              });
            else
              setUser({
                id: user.id,
                email: user.email,
                name: user.email?.split("@")[0],
              });
          } catch {
            setUser({
              id: user.id,
              email: user.email,
              name: user.email?.split("@")[0],
            });
          }
        }
        return { data, error, sessionExists: !!(data?.session || data?.user) };
      } catch (e) {
        toast("Sign in error", "error");
        return { error: e, sessionExists: false };
      }
    },
    [toast],
  );

  const signUp = useCallback(
    async ({ name, email, password }) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) {
          toast(error.message || "Sign up failed", "error");
          return { error };
        }
        const newUser = data?.user;
        const session = data?.session;
        if (newUser?.id) {
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                id: newUser.id,
                full_name: name || email.split("@")[0],
                email,
                role: "user",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              },
            ]);
          if (profileError)
            console.warn("Profile insert failed:", profileError.message);
        }
        if (newUser) {
          setUser({
            id: newUser.id,
            name: name || newUser.email?.split("@")[0],
            email: newUser.email,
          });
          toast("Account created successfully!", "success");
        } else {
          toast("Check your email to verify your account", "info");
        }
        return { data, error: null, sessionExists: !!session };
      } catch (e) {
        console.error("SignUp error:", e);
        toast("Sign up error", "error");
        return { error: e, sessionExists: false };
      }
    },
    [toast],
  );

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast("Sign out failed", "error");
        return { error };
      }
      setUser(null);
      return {};
    } catch (e) {
      toast("Sign out error", "error");
      return { error: e };
    }
  }, [toast]);

  const login = useCallback(
    (userData) => {
      setUser(userData);
      toast(`Welcome back, ${userData.name}!`);
    },
    [toast],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("cf_entered");
    toast("Logged out successfully", "info");
  }, [toast]);

  /* ── Customers ── */
  const addCustomer = useCallback(
    (data) => {
      const newC = { id: uid(), ...data, createdAt: new Date().toISOString() };
      setCustomers((prev) => [newC, ...prev]);
      toast("Customer added successfully");
      (async () => {
        try {
          const { error } = await supabase.from("customers").insert([newC]);
          if (error) toast("Failed to sync customer", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
      return newC;
    },
    [toast],
  );

  const updateCustomer = useCallback(
    (id, data) => {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c)),
      );
      toast("Customer updated");
      (async () => {
        try {
          const { error } = await supabase
            .from("customers")
            .update(data)
            .eq("id", id);
          if (error) toast("Failed to update customer", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
    },
    [toast],
  );

  const deleteCustomer = useCallback(
    (id) => {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setOrders((prev) => prev.filter((o) => o.customerId !== id));
      toast("Customer removed", "info");
      (async () => {
        try {
          const { error } = await supabase
            .from("customers")
            .delete()
            .eq("id", id);
          if (error) toast("Failed to delete customer", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
    },
    [toast],
  );

  /* ── Orders ── */
  const addOrder = useCallback(
    (data) => {
      const newO = { id: uid(), ...data, createdAt: new Date().toISOString() };
      setOrders((prev) => [newO, ...prev]);
      toast("Order created");
      (async () => {
        try {
          const { error } = await supabase.from("orders").insert([
            {
              id: newO.id,
              customer_id: newO.customerId,
              item: newO.item,
              amount: newO.amount,
              status: newO.status,
              created_at: newO.createdAt,
            },
          ]);
          if (error) toast("Failed to sync order", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
      return newO;
    },
    [toast],
  );

  const updateOrder = useCallback(
    (id, data) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...data } : o)),
      );
      toast("Order updated");
      (async () => {
        try {
          const payload = { ...data };
          if (payload.customerId) {
            payload.customer_id = payload.customerId;
            delete payload.customerId;
          }
          if (payload.createdAt) {
            payload.created_at = payload.createdAt;
            delete payload.createdAt;
          }
          const { error } = await supabase
            .from("orders")
            .update(payload)
            .eq("id", id);
          if (error) toast("Failed to update order", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
    },
    [toast],
  );

  const deleteOrder = useCallback(
    (id) => {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast("Order deleted", "info");
      (async () => {
        try {
          const { error } = await supabase.from("orders").delete().eq("id", id);
          if (error) toast("Failed to delete order", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
    },
    [toast],
  );

  /* ── Replies ── */
  const addReply = useCallback(
    (data) => {
      const newR = { id: uid(), ...data };
      setReplies((prev) => [...prev, newR]);
      toast("Quick reply saved");
      (async () => {
        try {
          const { error } = await supabase.from("replies").insert([
            {
              id: newR.id,
              title: newR.title,
              message: newR.message,
              created_at: newR.createdAt || new Date().toISOString(),
            },
          ]);
          if (error) toast("Failed to sync reply", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
      return newR;
    },
    [toast],
  );

  const updateReply = useCallback(
    (id, data) => {
      setReplies((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...data } : r)),
      );
      toast("Reply updated");
      (async () => {
        try {
          const payload = { ...data };
          if (payload.createdAt) {
            payload.created_at = payload.createdAt;
            delete payload.createdAt;
          }
          const { error } = await supabase
            .from("replies")
            .update(payload)
            .eq("id", id);
          if (error) toast("Failed to update reply", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
    },
    [toast],
  );

  const deleteReply = useCallback(
    (id) => {
      setReplies((prev) => prev.filter((r) => r.id !== id));
      toast("Reply deleted", "info");
      (async () => {
        try {
          const { error } = await supabase
            .from("replies")
            .delete()
            .eq("id", id);
          if (error) toast("Failed to delete reply", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
    },
    [toast],
  );

  /* ── Broadcasts ── */
  const addBroadcast = useCallback(
    (data) => {
      const newB = { id: uid(), ...data, sentAt: new Date().toISOString() };
      setBroadcasts((prev) => [newB, ...prev]);
      toast("Broadcast logged");
      (async () => {
        try {
          const { error } = await supabase.from("broadcasts").insert([
            {
              id: newB.id,
              audience: newB.audience || null,
              message: newB.message,
              metadata: newB.metadata || null,
              sent_at: newB.sentAt,
              created_at: newB.createdAt || new Date().toISOString(),
            },
          ]);
          if (error) toast("Failed to sync broadcast", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
      return newB;
    },
    [toast],
  );

  /* ── Invoices ── */
  const addInvoice = useCallback(
    (data) => {
      const newI = { id: uid(), ...data, createdAt: new Date().toISOString() };
      setInvoices((prev) => [newI, ...prev]);
      toast("Invoice created");
      (async () => {
        try {
          const { error } = await supabase.from("invoices").insert([
            {
              id: newI.id,
              order_id: newI.orderId || null,
              customer_id: newI.customerId,
              invoice_number: newI.invoiceNumber,
              business_name: newI.businessName,
              business_phone: newI.businessPhone,
              business_email: newI.businessEmail,
              items: newI.items,
              subtotal: newI.subtotal,
              discount: newI.discount || 0,
              tax: newI.tax || 0,
              total: newI.total,
              notes: newI.notes || "",
              status: newI.status || "unpaid",
              due_date: newI.dueDate || null,
              created_at: newI.createdAt,
            },
          ]);
          if (error) toast("Failed to sync invoice", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
      return newI;
    },
    [toast],
  );

  const updateInvoice = useCallback(
    (id, data) => {
      setInvoices((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...data } : i)),
      );
      toast("Invoice updated");
      (async () => {
        try {
          const payload = {};
          if (data.status !== undefined) payload.status = data.status;
          if (data.paidAt !== undefined) payload.paid_at = data.paidAt;
          if (data.notes !== undefined) payload.notes = data.notes;
          if (data.dueDate !== undefined) payload.due_date = data.dueDate;
          const { error } = await supabase
            .from("invoices")
            .update(payload)
            .eq("id", id);
          if (error) toast("Failed to update invoice", "error");
        } catch (e) {
          console.warn(e);
        }
      })();
    },
    [toast],
  );

  const deleteInvoice = useCallback(
    (id) => {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      toast("Invoice deleted", "info");
      (async () => {
        try {
          await supabase.from("invoices").delete().eq("id", id);
        } catch (e) {
          console.warn(e);
        }
      })();
    },
    [toast],
  );

  /* ── Derived stats ── */
  const stats = {
    totalCustomers: customers.length,
    activeOrders: orders.filter((o) => o.status !== "Delivered").length,
    revenue: orders
      .filter((o) => o.status === "Delivered")
      .reduce((sum, o) => sum + (Number(o.amount) || 0), 0),
    broadcastsSent: broadcasts.length,
    unpaidInvoices: invoices.filter((i) => i.status === "unpaid").length,
  };

  // plan
  const PLAN_LIMITS = {
    free: {
      customers: 20,
      orders: 50,
      replies: 5,
      invoices: 3,
      broadcast: false,
    },
    pro: {
      customers: Infinity,
      orders: Infinity,
      replies: Infinity,
      invoices: Infinity,
      broadcast: true,
    },
  };

  const plan = user?.role === "pro" ? "pro" : "free";
  const limits = PLAN_LIMITS[plan];

  const canAdd = {
    customer: customers.length < limits.customers,
    order: orders.length < limits.orders,
    reply: replies.length < limits.replies,
    invoice: invoices.length < limits.invoices,
    broadcast: limits.broadcast,
  };

  /* ── Helpers ── */
  const getCustomer = useCallback(
    (id) => customers.find((c) => c.id === id),
    [customers],
  );

  const formatPhone = useCallback((phone) => {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) return "234" + digits.slice(1);
    if (digits.startsWith("234")) return digits;
    return "234" + digits;
  }, []);

  const waLink = useCallback(
    (phone, message = "") => {
      const num = formatPhone(phone);
      const encoded = encodeURIComponent(message);
      return `https://wa.me/${num}${encoded ? "?text=" + encoded : ""}`;
    },
    [formatPhone],
  );

  const formatNaira = useCallback(
    (amount) => "₦" + Number(amount).toLocaleString("en-NG"),
    [],
  );

  return {
    user,
    customers,
    orders,
    replies,
    broadcasts,
    invoices,
    toasts,
    stats,
    login,
    logout,
    signIn,
    signUp,
    signOut,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addOrder,
    updateOrder,
    deleteOrder,
    addReply,
    updateReply,
    deleteReply,
    addBroadcast,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    getCustomer,
    waLink,
    formatNaira,
    toast,
    plan,
    limits,
    canAdd,
  };
}
