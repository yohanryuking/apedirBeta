import React, { createContext, useState, useEffect } from 'react';
import { supabase } from './services/client';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [cart, setCart] = useState([]);
  const [users, setUsers] = useState([]);
  const [categoryBusiness, setCategoryBusiness] = useState([]);
  const [cayegoryProducts, setCayegoryProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventsRegister, setEventsRegister] = useState([]);
  const [orders, setOrders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [sellsTotal, setSellsTotal] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [suscripciones, setSuscripciones] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [views, setViews] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const [isUserDataLoaded, setIsUserDataLoaded] = useState(false);
  const [isAllDataLoaded, setIsAllDataLoaded] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
      const user = await supabase.auth.getUser();
      if (user?.data) {
        setUserId(user.data.user.id);
        setUserEmail(user.data.user.email);
        console.log('si hay data')
        setIsUserDataLoaded(true);
      } else {
        console.log('no hay data')
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (isUserDataLoaded) {
      const loadAllData = async () => {

        const loadProducts = async () => {
          const { data, error } = await supabase.from('products').select('*');
          if (error) {
            console.error('Error loading products:', error);
          } else {
            setProducts(data);
            console.log(data)
          }
        };

        const loadBusinesses = async () => {
          const { data, error } = await supabase
            .from('business')
            .select('*')
          if (error) {
            console.error('Error loading businesses:', error);
          } else {
            setBusinesses(data);

          }
        };

        const loadCart = async () => {
          const { data, error } = await supabase
            .from('cart')
            .select('*')
            .eq('userId', userId);
          if (error) {
            console.error('Error loading cart:', error);
          } else {
            setCart(data);

          }
        };

        const loadUsers = async () => {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId);
          if (error) {
            console.error('Error loading users:', error);
          } else {
            setUsers(data[0]);

          }
        };

        const loadCategoryBusiness = async () => {
          const { data, error } = await supabase.from('categoryBusiness').select('*');
          if (error) {
            console.error('Error loading categoryBusiness:', error);
          } else {
            setCategoryBusiness(data);

          }
        };

        const loadCayegoryProducts = async () => {
          const { data, error } = await supabase.from('cayegoryProducts').select('*');
          if (error) {
            console.error('Error loading categoryProducts:', error);
          } else {
            setCayegoryProducts(data);

          }
        };

        const loadEvents = async () => {
          const { data, error } = await supabase.from('events').select('*');
          if (error) {
            console.error('Error loading events:', error);
          } else {
            setEvents(data);

          }
        };

        const loadEventsRegister = async () => {
          const { data, error } = await supabase.from('eventsRegister').select('*');
          if (error) {
            console.error('Error loading eventsRegister:', error);
          } else {
            setEventsRegister(data);

          }
        };

        const loadOrders = async () => {
          const { data, error } = await supabase.from('orders').select('*');
          if (error) {
            console.error('Error loading orders:', error);
          } else {
            setOrders(data);

          }
        };

        const loadPosts = async () => {
          const { data, error } = await supabase.from('posts').select('*');
          if (error) {
            console.error('Error loading posts:', error);
          } else {
            setPosts(data);

          }
        };

        // const loadSellsTotal = async () => {
        //   const { data, error } = await supabase.from('sellsTotal').select('*');
        //   if (error) {
        //     console.error('Error loading sellsTotal:', error);
        //   } else {
        //     setSellsTotal(data);
        //   }
        // };

        const loadSocialLinks = async () => {
          const { data, error } = await supabase.from('social_links').select('*');
          if (error) {
            console.error('Error loading socialLinks:', error);
          } else {
            setSocialLinks(data);

          }
        };

        // const loadSuscripciones = async () => {
        //   const { data, error } = await supabase.from('suscripciones').select('*');
        //   if (error) {
        //     console.error('Error loading suscripciones:', error);
        //   } else {
        //     setSuscripciones(data);
        //   }
        // };

        // const loadVentas = async () => {
        //   const { data, error } = await supabase.from('ventas').select('*');
        //   if (error) {
        //     console.error('Error loading ventas:', error);
        //   } else {
        //     setVentas(data);
        //   }
        // };

        // const loadViews = async () => {
        //   const { data, error } = await supabase.from('views').select('*');
        //   if (error) {
        //     console.error('Error loading views:', error);
        //   } else {
        //     setViews(data);
        //   }
        // };

        try {
          await Promise.all([
            loadProducts(),
            loadBusinesses(),
            loadCart(),
            loadUsers(),
            loadCategoryBusiness(),
            loadCayegoryProducts(),
            loadEvents(),
            // loadEventsRegister(),
            // loadOrders(),
            loadPosts(),
            // loadSellsTotal(),
            loadSocialLinks(),
            // loadSuscripciones(),
            // loadVentas(),
            // loadViews(),
          ]);
          setIsAllDataLoaded(true);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      };

      loadAllData();
    }
  }, [isUserDataLoaded]);

  const updatePostInContext = (updatedPost) => {
    setPosts(posts.map(post =>
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  return (
    <AppContext.Provider value={{ products, setProducts, businesses, cart, users, categoryBusiness, cayegoryProducts, events, eventsRegister, orders, posts, updatePostInContext, sellsTotal, socialLinks, suscripciones, ventas, views, userId, userEmail, isUserDataLoaded, isAllDataLoaded }}>
      {children}
    </AppContext.Provider>
  );
};