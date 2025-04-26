import React, { useState } from 'react';
import styles from './Header.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import authService from '../../authService';

const kc = authService.kc;

const Header = ({ logoText, avatarUrl, notificationCount = 3 }) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Пример данных для уведомлений
  const notifications = [
    { 
      id: 1, 
      text: 'Your subscription has been updated', 
      time: '2 hours ago',
      read: false
    },
    { 
      id: 2, 
      text: 'New message from Sarah Williams', 
      time: '5 hours ago',
      read: true
    },
    { 
      id: 3, 
      text: 'Your document has been approved', 
      time: '1 day ago',
      read: true
    },
  ];

  return (
    <> 
      <header className={styles.headerContainer}>
        <Link to={"/"} className={styles.headerContainer_logo}>
          {logoText}
        </Link>

        {/* Действия справа */}
        {kc.authenticated && <div className={styles.headerContainer_actions}>
          {/* Иконка уведомлений */}
          <div className={styles.headerContainer_dropdown}>
            <div 
              className={styles.headerContainer_icon}
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              role="button"
              aria-label="Notifications"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6981 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {notificationCount > 0 && (
                <span className={styles.headerContainer_iconBadge}>
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </div>
            
            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  className={styles.headerContainer_notifications}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', color: '#1e293b' }}>Notifications</h3>
                  </div>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={styles.headerContainer_notificationItem}
                    >
                      {!notification.read && <div className={styles.headerContainer_notificationDot} />}
                      <div>
                        <div className={styles.headerContainer_notificationContent}>
                          {notification.text}
                        </div>
                        <div className={styles.headerContainer_notificationTime}>
                          {notification.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Аватар пользователя */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="User Avatar"
              className={styles.headerContainer_avatar}
              onError={(e) => {
                e.target.src = '';
                e.target.textContent = '👤';
              }}
            />
          ) : (
            <div className={styles.headerContainer_avatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>}
      </header>
    </>
  );
};

export default Header;