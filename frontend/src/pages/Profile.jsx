import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toolbar from "../components/Toolbar";
import CafeIcon from "../components/CafeIcon";
import {
  clearSession,
  getAddresses,
  getAppPreferences,
  getLanguagePreference,
  getNotificationSettings,
  getOrderHistory,
  getUserProfile,
  setAddresses,
  setAppPreferences,
  setLanguagePreference,
  setNotificationSettings,
  setUserProfile,
} from "../lib/storage";
import { apiGet, apiPut } from "../lib/api";
import { useLanguage } from "../components/LanguageProvider";

const languageOptions = [
  "English",
  "Hindi (Hindi)",
  "Telugu (Telugu)",
  "Tamil (Tamil)",
  "Kannada (Kannada)",
  "Bengali (Bangla)",
];

const defaultAddressDraft = {
  id: "",
  label: "",
  icon: "home",
  line: "",
  city: "",
  pincode: "",
  isDefault: false,
};

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      className={`profile-switch ${checked ? "is-on" : ""}`}
      onClick={onChange}
      aria-pressed={checked}
    >
      <span />
    </button>
  );
}

function Profile() {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const storedUser = getUserProfile();
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [addressesOpen, setAddressesOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [profileDraft, setProfileDraft] = useState({
    name: storedUser.name || "Food Lover",
    email: storedUser.email || "foodlover@example.com",
    phone: storedUser.phone || "+91 98765 43210",
    address: storedUser.address || "123 Food Street, New Delhi",
    city: storedUser.city || "New Delhi",
    pincode: storedUser.pincode || "110001",
  });
  const [orders, setOrders] = useState(getOrderHistory());
  const [saving, setSaving] = useState(false);
  const [notificationSettings, setNotificationState] = useState(getNotificationSettings());
  const [appPreferences, setPreferenceState] = useState(() => ({
    ...getAppPreferences(),
    language: getLanguagePreference(),
  }));
  const [savedAddresses, setSavedAddressesState] = useState(() => {
    const existing = getAddresses();
    return existing.length
      ? existing
      : [
          { id: "home", label: "Home", icon: "home", line: "123 Food Street", city: "New Delhi", pincode: "110001", isDefault: true },
          { id: "work", label: "Work", icon: "work", line: "456 Business Park", city: "Gurgaon", pincode: "122001", isDefault: false },
          { id: "mom", label: "Mom's Place", icon: "mapPin", line: "789 Main Road", city: "Noida", pincode: "201301", isDefault: false },
        ];
  });
  const [addressEditorOpen, setAddressEditorOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState(defaultAddressDraft);

  useEffect(() => {
    setAddresses(savedAddresses);
  }, [savedAddresses]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    apiGet("/me")
      .then((user) => {
        setUserProfile(user);
        setProfileDraft((current) => ({
          ...current,
          name: user.name || current.name,
          email: user.email || current.email,
          phone: user.phone || current.phone,
          address: user.address || current.address,
          city: user.city || current.city,
          pincode: user.pincode || current.pincode,
        }));
      })
      .catch(() => {});

    apiGet("/my-orders")
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setOrders(data);
        }
      })
      .catch(() => {});
  }, []);

  const recentOrders = useMemo(
    () =>
      (orders.length
        ? orders
        : [
            { orderId: "demo-1", restaurantName: "Spice Junction", total: 420, date: "10 Apr 2026", status: "Delivered", items: [{}, {}, {}] },
            { orderId: "demo-2", restaurantName: "Chai Shai", total: 280, date: "8 Apr 2026", status: "Delivered", items: [{}, {}] },
            { orderId: "demo-3", restaurantName: "Biryani House", total: 560, date: "5 Apr 2026", status: "Delivered", items: [{}, {}, {}, {}] },
            { orderId: "demo-4", restaurantName: "Dosa Plaza", total: 140, date: "2 Apr 2026", status: "Delivered", items: [{}] },
          ])
        .slice(0, 4),
    [orders]
  );

  const saveProfile = async () => {
    setSaving(true);
    try {
      const response = await apiPut("/me", profileDraft);
      setUserProfile(response.user || profileDraft);
      setProfileEditorOpen(false);
      setToast({ title: t("Profile updated"), text: t("Your profile details were saved successfully.") });
    } catch (error) {
      alert(error.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  const openAddressEditor = (address = defaultAddressDraft) => {
    setAddressDraft(address);
    setAddressEditorOpen(true);
  };

  const saveAddress = () => {
    if (!addressDraft.label || !addressDraft.line || !addressDraft.city || !addressDraft.pincode) {
      alert("Please fill all address details");
      return;
    }

    const nextAddress = {
      ...addressDraft,
      id: addressDraft.id || `addr-${Date.now()}`,
      icon: addressDraft.icon || "home",
    };

    let nextAddresses = savedAddresses.some((item) => item.id === nextAddress.id)
      ? savedAddresses.map((item) => (item.id === nextAddress.id ? nextAddress : item))
      : [nextAddress, ...savedAddresses];

    if (nextAddress.isDefault) {
      nextAddresses = nextAddresses.map((item) => ({ ...item, isDefault: item.id === nextAddress.id }));
    }

    setSavedAddressesState(nextAddresses);
    setAddressEditorOpen(false);
    setToast({ title: t("Address saved"), text: `${nextAddress.label} ${t("Address saved").toLowerCase()}.` });
  };

  const deleteAddress = (addressId) => {
    const nextAddresses = savedAddresses.filter((item) => item.id !== addressId);
    setSavedAddressesState(nextAddresses);
    setToast({ title: t("Address deleted"), text: t("The saved address has been removed.") });
  };

  const setDefaultAddress = (addressId) => {
    setSavedAddressesState((current) =>
      current.map((item) => ({ ...item, isDefault: item.id === addressId }))
    );
    setToast({ title: t("Default changed"), text: t("Your default address was updated.") });
  };

  const saveNotifications = () => {
    setNotificationSettings(notificationSettings);
    setNotificationsOpen(false);
    setToast({ title: t("Notifications saved"), text: t("Your notification preferences were updated.") });
  };

  const savePreferences = () => {
    setAppPreferences(appPreferences);
    setLanguagePreference(appPreferences.language);
    setPreferencesOpen(false);
    setToast({ title: t("Preferences saved"), text: t("App preferences have been updated.") });
  };

  const clearCache = () => {
    setPreferenceState((current) => ({ ...current, cacheSize: "0 MB" }));
    setToast({ title: t("Cache cleared"), text: t("128.5 MB freed up.") });
  };

  const closePanels = () => {
    setNotificationsOpen(false);
    setAddressesOpen(false);
    setPreferencesOpen(false);
    setAddressEditorOpen(false);
  };

  return (
    <>
      <Toolbar />
      <div className="app-page-shell">
        <div className="app-content-shell">
          <section className="profile-hero">
            <div className="profile-hero__avatar">
              <CafeIcon kind="profile" />
            </div>
            <div className="profile-hero__content">
              <h1>{profileDraft.name}</h1>
              <p><CafeIcon kind="browse" /> {profileDraft.email}</p>
              <p><CafeIcon kind="chat" /> {profileDraft.phone}</p>
              <p><CafeIcon kind="mapPin" /> {profileDraft.address}</p>
            </div>
            <button type="button" className="profile-hero__settings" onClick={() => setProfileEditorOpen(true)}>
              <CafeIcon kind="settings" />
            </button>
          </section>

          {profileEditorOpen ? (
            <section className="profile-editor-card">
              <div className="section-title-row">
                <h2><CafeIcon kind="settings" /> {t("Edit Profile")}</h2>
                <button type="button" className="profile-editor-card__close" onClick={() => setProfileEditorOpen(false)}>
                  {t("Close")}
                </button>
              </div>
              <div className="profile-editor-grid">
                <input className="luxury-input" value={profileDraft.name} onChange={(event) => setProfileDraft((current) => ({ ...current, name: event.target.value }))} placeholder="Name" />
                <input className="luxury-input" value={profileDraft.email} onChange={(event) => setProfileDraft((current) => ({ ...current, email: event.target.value }))} placeholder="Email" />
                <input className="luxury-input" value={profileDraft.phone} onChange={(event) => setProfileDraft((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" />
                <input className="luxury-input" value={profileDraft.address} onChange={(event) => setProfileDraft((current) => ({ ...current, address: event.target.value }))} placeholder="Address" />
                <input className="luxury-input" value={profileDraft.city} onChange={(event) => setProfileDraft((current) => ({ ...current, city: event.target.value }))} placeholder="City" />
                <input className="luxury-input" value={profileDraft.pincode} onChange={(event) => setProfileDraft((current) => ({ ...current, pincode: event.target.value }))} placeholder="Pincode" />
              </div>
              <div className="profile-editor-actions">
                <button type="button" className="profile-editor-actions__ghost" onClick={() => setProfileEditorOpen(false)}>{t("Cancel")}</button>
                <button type="button" className="profile-editor-actions__primary" onClick={saveProfile} disabled={saving}>{saving ? "Saving..." : t("Save Profile")}</button>
              </div>
            </section>
          ) : null}

          <section className="profile-top-grid">
            <article className="profile-card">
              <h2><CafeIcon kind="bolt" /> {t("Your Usual Order")}</h2>
              <ul className="profile-list">
                <li><span>Masala Chai</span><strong>Rs80</strong></li>
                <li><span>Veg Sandwich</span><strong>Rs120</strong></li>
              </ul>
              <button type="button" className="profile-cta" onClick={() => navigate("/menu")}>{t("Reorder Now")}</button>
            </article>

            <article className="profile-card">
              <h2><CafeIcon kind="heart" /> {t("Favorite Items")}</h2>
              <ul className="profile-pills">
                <li>Masala Chai <CafeIcon kind="arrowRight" /></li>
                <li>Paneer Tikka <CafeIcon kind="arrowRight" /></li>
                <li>Biryani <CafeIcon kind="arrowRight" /></li>
              </ul>
            </article>
          </section>

          <section className="section-block">
            <div className="section-title-row">
              <h2><CafeIcon kind="clock" /> {t("Order History")}</h2>
            </div>
            <div className="profile-history">
              {recentOrders.map((order) => (
                <article key={order._id || order.orderId || order.date} className="profile-history__card">
                  <div className="profile-history__left">
                    <div className="profile-history__icon"><CafeIcon kind="gift" /></div>
                    <div>
                      <h3>{order.restaurantName || "CafeFlow Order"}</h3>
                      <p>{(order.items?.length || 0)} items | {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : order.date || "Today"}</p>
                      <span>{order.status || "Delivered"}</span>
                    </div>
                  </div>
                  <div className="profile-history__right">
                    <strong>Rs{order.total || order.totalAmount || 0}</strong>
                    <button type="button" onClick={() => navigate("/menu")}>Reorder <CafeIcon kind="arrowRight" /></button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section-block profile-settings">
            <h2>Settings</h2>
            <div className="profile-settings__list">
              <button type="button" onClick={() => setNotificationsOpen(true)}><CafeIcon kind="bell" /> {t("Notifications")} <CafeIcon kind="arrowRight" /></button>
              <button type="button" onClick={() => setAddressesOpen(true)}><CafeIcon kind="mapPin" /> {t("Saved Addresses")} <CafeIcon kind="arrowRight" /></button>
              <button type="button" onClick={() => setPreferencesOpen(true)}><CafeIcon kind="settings" /> {t("App Preferences")} <CafeIcon kind="arrowRight" /></button>
              <button
                type="button"
                className="is-logout"
                onClick={() => {
                  clearSession();
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                <CafeIcon kind="arrowLeft" /> {t("Logout")} <CafeIcon kind="arrowRight" />
              </button>
            </div>
          </section>
        </div>
      </div>

      {(notificationsOpen || addressesOpen || preferencesOpen || addressEditorOpen) ? (
        <div className="profile-modal-backdrop" onClick={closePanels}>
          {notificationsOpen ? (
            <section className="profile-modal" onClick={(event) => event.stopPropagation()}>
              <div className="profile-modal__header">
                <h2><CafeIcon kind="bell" /> {t("Notifications")}</h2>
                <button type="button" onClick={() => setNotificationsOpen(false)}><CafeIcon kind="x" /></button>
              </div>
              <div className="profile-modal__body">
                <div className="profile-modal__group">
                  <h3>{t("What to notify")}</h3>
                  {[
                    ["orderUpdates", "Order Updates", "Track your order status"],
                    ["dealsOffers", "Deals & Offers", "Get notified about new deals"],
                    ["recommendations", "Recommendations", "AI-powered suggestions"],
                    ["loyaltyRewards", "Loyalty Rewards", "Points and achievements"],
                  ].map(([key, title, text]) => (
                    <div key={key} className="profile-toggle-row">
                      <div>
                        <strong>{t(title)}</strong>
                        <p>{t(text)}</p>
                      </div>
                      <Toggle checked={notificationSettings[key]} onChange={() => setNotificationState((current) => ({ ...current, [key]: !current[key] }))} />
                    </div>
                  ))}
                </div>
                <div className="profile-modal__group">
                  <h3>{t("How to notify")}</h3>
                  {[
                    ["pushNotifications", "Push Notifications", "In-app alerts"],
                    ["sms", "SMS", "Text messages"],
                    ["email", "Email", "Email updates"],
                  ].map(([key, title, text]) => (
                    <div key={key} className="profile-toggle-row">
                      <div>
                        <strong>{t(title)}</strong>
                        <p>{t(text)}</p>
                      </div>
                      <Toggle checked={notificationSettings[key]} onChange={() => setNotificationState((current) => ({ ...current, [key]: !current[key] }))} />
                    </div>
                  ))}
                </div>
              </div>
              <button type="button" className="profile-modal__save" onClick={saveNotifications}>{t("Save Preferences")}</button>
            </section>
          ) : null}

          {addressesOpen ? (
            <section className="profile-modal" onClick={(event) => event.stopPropagation()}>
              <div className="profile-modal__header">
                <h2><CafeIcon kind="mapPin" /> {t("Saved Addresses")}</h2>
                <button type="button" onClick={() => setAddressesOpen(false)}><CafeIcon kind="x" /></button>
              </div>
              <div className="profile-modal__body">
                <button type="button" className="profile-address-add" onClick={() => openAddressEditor({ ...defaultAddressDraft, icon: "home" })}>
                  <CafeIcon kind="plus" /> {t("Add New Address")}
                </button>

                <div className="profile-address-list">
                  {savedAddresses.map((address) => (
                    <article key={address.id} className={`profile-address-card ${address.isDefault ? "is-default" : ""}`}>
                      <div className="profile-address-card__top">
                        <div className="profile-address-card__icon"><CafeIcon kind={address.icon} /></div>
                        <div>
                          <div className="profile-address-card__title-row">
                            <strong>{address.label}</strong>
                            {address.isDefault ? <span>{t("Default")}</span> : null}
                          </div>
                          <p>{address.line}, {address.city}, {address.pincode}</p>
                        </div>
                      </div>
                      <div className="profile-address-card__actions">
                        {!address.isDefault ? (
                          <button type="button" className="is-muted" onClick={() => setDefaultAddress(address.id)}>{t("Set as Default")}</button>
                        ) : null}
                        <button type="button" onClick={() => openAddressEditor(address)}><CafeIcon kind="plus" /> {t("Edit")}</button>
                        <button type="button" className="is-danger" onClick={() => deleteAddress(address.id)}><CafeIcon kind="trash" /> {t("Delete")}</button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ) : null}

          {addressEditorOpen ? (
            <section className="profile-modal profile-modal--compact" onClick={(event) => event.stopPropagation()}>
              <div className="profile-modal__header">
                <h2><CafeIcon kind="plus" /> {addressDraft.id ? t("Edit Address") : t("Add Address")}</h2>
                <button type="button" onClick={() => setAddressEditorOpen(false)}><CafeIcon kind="x" /></button>
              </div>
              <div className="profile-modal__body">
                <div className="profile-editor-grid">
                  <input className="luxury-input" placeholder={t("Label")} value={addressDraft.label} onChange={(event) => setAddressDraft((current) => ({ ...current, label: event.target.value }))} />
                  <select className="luxury-select" value={addressDraft.icon || "home"} onChange={(event) => setAddressDraft((current) => ({ ...current, icon: event.target.value }))}>
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                    <option value="mapPin">Other</option>
                  </select>
                  <input className="luxury-input" placeholder={t("Address line")} value={addressDraft.line} onChange={(event) => setAddressDraft((current) => ({ ...current, line: event.target.value }))} />
                  <input className="luxury-input" placeholder={t("City")} value={addressDraft.city} onChange={(event) => setAddressDraft((current) => ({ ...current, city: event.target.value }))} />
                  <input className="luxury-input" placeholder={t("Pincode")} value={addressDraft.pincode} onChange={(event) => setAddressDraft((current) => ({ ...current, pincode: event.target.value }))} />
                </div>
                <label className="profile-checkbox-row">
                  <input
                    type="checkbox"
                    checked={addressDraft.isDefault}
                    onChange={(event) => setAddressDraft((current) => ({ ...current, isDefault: event.target.checked }))}
                  />
                  <span>{t("Set as default address")}</span>
                </label>
              </div>
              <button type="button" className="profile-modal__save" onClick={saveAddress}>{t("Save Address")}</button>
            </section>
          ) : null}

          {preferencesOpen ? (
            <section className="profile-modal" onClick={(event) => event.stopPropagation()}>
              <div className="profile-modal__header">
                <h2><CafeIcon kind="settings" /> {t("App Preferences")}</h2>
                <button type="button" onClick={() => setPreferencesOpen(false)}><CafeIcon kind="x" /></button>
              </div>
              <div className="profile-modal__body">
                <div className="profile-modal__group">
                  <h3>{t("Language")}</h3>
                  <select className="luxury-select" value={appPreferences.language} onChange={(event) => {
                    setPreferenceState((current) => ({ ...current, language: event.target.value }));
                    setLanguage(event.target.value);
                  }}>
                    {languageOptions.map((language) => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>

                <div className="profile-modal__group">
                  <h3>{t("App Settings")}</h3>
                  {[
                    ["autoplayVideos", "Auto-play Videos", "Auto-play deal videos"],
                    ["hapticFeedback", "Haptic Feedback", "Vibration on interactions"],
                    ["reducedMotion", "Reduced Motion", "Minimize animations"],
                    ["dataSaver", "Data Saver", "Reduce data usage"],
                  ].map(([key, title, text]) => (
                    <div key={key} className="profile-toggle-row">
                      <div>
                        <strong>{t(title)}</strong>
                        <p>{t(text)}</p>
                      </div>
                      <Toggle checked={appPreferences[key]} onChange={() => setPreferenceState((current) => ({ ...current, [key]: !current[key] }))} />
                    </div>
                  ))}
                </div>

                <div className="profile-cache-card">
                  <div>
                    <strong>{t("Cache Size")}</strong>
                    <p>{appPreferences.cacheSize}</p>
                  </div>
                  <button type="button" onClick={clearCache}>{t("Clear Cache")}</button>
                </div>
              </div>
              <button type="button" className="profile-modal__save" onClick={savePreferences}>{t("Save Preferences")}</button>
            </section>
          ) : null}
        </div>
      ) : null}

      {toast ? (
        <div className="profile-toast">
          <div className="profile-toast__icon"><CafeIcon kind="check" /></div>
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.text}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Profile;
