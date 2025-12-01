import type { AppSchema } from '../lib/utils/schema';

export interface Example {
  id: string;
  title: string;
  description: string;
  natural: string;
  json: AppSchema;
  smpl: string;
}

export const examples: Example[] = [
  {
    id: 'todo-app',
    title: 'Todo App',
    description: 'A simple task management application with categories and priorities',
    natural: `Build a todo app with the following features:
- Home page showing all tasks in a list
- Add task form with title, description, category, and priority
- Mark tasks as complete
- Filter by category (Work, Personal, Shopping)
- Delete completed tasks`,
    json: {
      app_name: 'TaskMaster',
      platform: 'web',
      description: 'A task management application for organizing daily todos',
      pages: [
        {
          id: 'home',
          type: 'feed',
          title: 'Home',
          components: ['header', 'task-list', 'add-task-form', 'filter-bar']
        }
      ],
      data_models: [
        {
          name: 'Task',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'title', type: 'string', required: true },
            { name: 'description', type: 'string', required: false },
            { name: 'category', type: 'string', required: true },
            { name: 'priority', type: 'string', required: true },
            { name: 'completed', type: 'boolean', required: true },
            { name: 'created_at', type: 'timestamp', required: true }
          ]
        }
      ],
      actions: [
        {
          name: 'CreateTask',
          triggers: ['form.submit'],
          steps: ['validate_input', 'insert_record', 'refresh_list']
        },
        {
          name: 'CompleteTask',
          triggers: ['checkbox.click'],
          steps: ['update_record', 'show_notification']
        },
        {
          name: 'DeleteTask',
          triggers: ['button.click'],
          steps: ['confirm_dialog', 'delete_record', 'refresh_list']
        }
      ]
    },
    smpl: `APP(TaskMaster){
  pages:
    home[feed]: header,task-list,add-task-form,filter-bar
  models:
    Task: id:string!, title:string!, description:string, category:string!, priority:string!, completed:boolean!, created_at:timestamp!
  actions:
    CreateTask: form.submit -> validate_input > insert_record > refresh_list
    CompleteTask: checkbox.click -> update_record > show_notification
    DeleteTask: button.click -> confirm_dialog > delete_record > refresh_list
}`
  },
  {
    id: 'journal-app',
    title: 'Journal App',
    description: 'A daily journaling application with mood tracking and tags',
    natural: `Create a journaling app where users can:
- Write daily journal entries with title and content
- Track their mood (happy, neutral, sad, anxious)
- Add tags to entries (reflection, gratitude, goals)
- View a timeline of all entries
- Search entries by tag or date`,
    json: {
      app_name: 'DailyReflect',
      platform: 'web',
      description: 'A journaling app for tracking thoughts and moods',
      pages: [
        {
          id: 'timeline',
          type: 'feed',
          title: 'Timeline',
          components: ['header', 'entry-list', 'search-bar', 'mood-filter']
        },
        {
          id: 'new-entry',
          type: 'form',
          title: 'New Entry',
          components: ['entry-form', 'mood-selector', 'tag-input', 'save-button']
        },
        {
          id: 'entry-detail',
          type: 'detail',
          title: 'Entry Detail',
          components: ['entry-content', 'mood-display', 'tags', 'edit-button', 'delete-button']
        }
      ],
      data_models: [
        {
          name: 'Entry',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'title', type: 'string', required: true },
            { name: 'content', type: 'text', required: true },
            { name: 'mood', type: 'string', required: true },
            { name: 'tags', type: 'array', required: false },
            { name: 'created_at', type: 'timestamp', required: true },
            { name: 'updated_at', type: 'timestamp', required: false }
          ]
        }
      ],
      actions: [
        {
          name: 'CreateEntry',
          triggers: ['form.submit'],
          steps: ['validate_entry', 'insert_record', 'navigate.timeline']
        },
        {
          name: 'SearchEntries',
          triggers: ['search.input'],
          steps: ['query_database', 'filter_results', 'update_list']
        },
        {
          name: 'DeleteEntry',
          triggers: ['button.click'],
          steps: ['confirm_delete', 'delete_record', 'navigate.timeline']
        }
      ]
    },
    smpl: `APP(DailyReflect){
  pages:
    timeline[feed]: header,entry-list,search-bar,mood-filter
    new-entry[form]: entry-form,mood-selector,tag-input,save-button
    entry-detail[detail]: entry-content,mood-display,tags,edit-button,delete-button
  models:
    Entry: id:string!, title:string!, content:text!, mood:string!, tags:array, created_at:timestamp!, updated_at:timestamp
  actions:
    CreateEntry: form.submit -> validate_entry > insert_record > navigate.timeline
    SearchEntries: search.input -> query_database > filter_results > update_list
    DeleteEntry: button.click -> confirm_delete > delete_record > navigate.timeline
}`
  },
  {
    id: 'messaging-app',
    title: 'Messaging App',
    description: 'A real-time chat application with channels and direct messages',
    natural: `Build a messaging app with these features:
- List of channels and direct messages
- Real-time message updates
- Send text messages with timestamp
- User online/offline status
- Message read receipts
- Create new channels
- User profiles with avatar`,
    json: {
      app_name: 'ChatFlow',
      platform: 'web',
      description: 'A real-time messaging application with channels and DMs',
      pages: [
        {
          id: 'channels',
          type: 'feed',
          title: 'Channels',
          components: ['sidebar', 'channel-list', 'create-channel-button', 'user-status']
        },
        {
          id: 'chat',
          type: 'detail',
          title: 'Chat',
          components: ['message-list', 'message-input', 'user-info', 'typing-indicator']
        },
        {
          id: 'profile',
          type: 'detail',
          title: 'Profile',
          components: ['avatar', 'username', 'status', 'settings-button']
        }
      ],
      data_models: [
        {
          name: 'User',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'username', type: 'string', required: true },
            { name: 'avatar', type: 'string', required: false },
            { name: 'status', type: 'string', required: true },
            { name: 'last_seen', type: 'timestamp', required: false }
          ]
        },
        {
          name: 'Channel',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'name', type: 'string', required: true },
            { name: 'description', type: 'string', required: false },
            { name: 'created_by', type: 'string', required: true },
            { name: 'created_at', type: 'timestamp', required: true }
          ]
        },
        {
          name: 'Message',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'channel_id', type: 'string', required: true },
            { name: 'user_id', type: 'string', required: true },
            { name: 'content', type: 'text', required: true },
            { name: 'read', type: 'boolean', required: true },
            { name: 'created_at', type: 'timestamp', required: true }
          ]
        }
      ],
      actions: [
        {
          name: 'SendMessage',
          triggers: ['form.submit', 'enter.key'],
          steps: ['validate_message', 'insert_record', 'broadcast_update', 'clear_input']
        },
        {
          name: 'CreateChannel',
          triggers: ['button.click'],
          steps: ['show_modal', 'validate_name', 'insert_record', 'navigate.channel']
        },
        {
          name: 'MarkAsRead',
          triggers: ['message.view'],
          steps: ['update_record', 'update_badge']
        }
      ]
    },
    smpl: `APP(ChatFlow){
  pages:
    channels[feed]: sidebar,channel-list,create-channel-button,user-status
    chat[detail]: message-list,message-input,user-info,typing-indicator
    profile[detail]: avatar,username,status,settings-button
  models:
    User: id:string!, username:string!, avatar:string, status:string!, last_seen:timestamp
    Channel: id:string!, name:string!, description:string, created_by:string!, created_at:timestamp!
    Message: id:string!, channel_id:string!, user_id:string!, content:text!, read:boolean!, created_at:timestamp!
  actions:
    SendMessage: form.submit|enter.key -> validate_message > insert_record > broadcast_update > clear_input
    CreateChannel: button.click -> show_modal > validate_name > insert_record > navigate.channel
    MarkAsRead: message.view -> update_record > update_badge
}`
  },
  {
    id: 'recipe-manager',
    title: 'Recipe Manager',
    description: 'A recipe collection app with ingredients, instructions, and ratings',
    natural: `Create a recipe manager where users can:
- Browse recipe cards with images
- View detailed recipe with ingredients and steps
- Rate recipes (1-5 stars)
- Save favorite recipes
- Search by ingredient or cuisine type
- Add personal notes to recipes`,
    json: {
      app_name: 'RecipeBox',
      platform: 'web',
      description: 'A recipe collection and management application',
      pages: [
        {
          id: 'home',
          type: 'feed',
          title: 'Home',
          components: ['header', 'recipe-grid', 'search-bar', 'filter-dropdown']
        },
        {
          id: 'recipe',
          type: 'detail',
          title: 'Recipe Detail',
          components: ['recipe-image', 'title', 'ingredients-list', 'instructions', 'rating-stars', 'save-button', 'notes-section']
        },
        {
          id: 'favorites',
          type: 'feed',
          title: 'Favorites',
          components: ['header', 'saved-recipes-list', 'empty-state']
        }
      ],
      data_models: [
        {
          name: 'Recipe',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'title', type: 'string', required: true },
            { name: 'image', type: 'string', required: false },
            { name: 'cuisine', type: 'string', required: true },
            { name: 'prep_time', type: 'number', required: true },
            { name: 'cook_time', type: 'number', required: true },
            { name: 'servings', type: 'number', required: true },
            { name: 'ingredients', type: 'array', required: true },
            { name: 'instructions', type: 'array', required: true }
          ]
        },
        {
          name: 'Rating',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'recipe_id', type: 'string', required: true },
            { name: 'user_id', type: 'string', required: true },
            { name: 'stars', type: 'number', required: true },
            { name: 'notes', type: 'text', required: false }
          ]
        }
      ],
      actions: [
        {
          name: 'SaveRecipe',
          triggers: ['button.click'],
          steps: ['insert_favorite', 'update_ui', 'show_toast']
        },
        {
          name: 'RateRecipe',
          triggers: ['star.click'],
          steps: ['validate_rating', 'insert_record', 'calculate_average', 'update_display']
        },
        {
          name: 'SearchRecipes',
          triggers: ['search.input'],
          steps: ['query_database', 'filter_by_ingredient', 'update_grid']
        }
      ]
    },
    smpl: `APP(RecipeBox){
  pages:
    home[feed]: header,recipe-grid,search-bar,filter-dropdown
    recipe[detail]: recipe-image,title,ingredients-list,instructions,rating-stars,save-button,notes-section
    favorites[feed]: header,saved-recipes-list,empty-state
  models:
    Recipe: id:string!, title:string!, image:string, cuisine:string!, prep_time:number!, cook_time:number!, servings:number!, ingredients:array!, instructions:array!
    Rating: id:string!, recipe_id:string!, user_id:string!, stars:number!, notes:text
  actions:
    SaveRecipe: button.click -> insert_favorite > update_ui > show_toast
    RateRecipe: star.click -> validate_rating > insert_record > calculate_average > update_display
    SearchRecipes: search.input -> query_database > filter_by_ingredient > update_grid
}`
  },
  {
    id: 'blog-engine',
    title: 'Blog Engine',
    description: 'A content management system for writing and publishing blog posts',
    natural: `Build a blog platform with:
- List of published posts on homepage
- Individual post pages with content and comments
- Admin dashboard for creating/editing posts
- Rich text editor with formatting
- Categories and tags for posts
- Comment system with moderation
- Draft and published states`,
    json: {
      app_name: 'BlogCraft',
      platform: 'web',
      description: 'A blog engine with content management and commenting',
      pages: [
        {
          id: 'home',
          type: 'feed',
          title: 'Home',
          components: ['navbar', 'post-grid', 'category-filter', 'search']
        },
        {
          id: 'post',
          type: 'detail',
          title: 'Post',
          components: ['post-header', 'post-content', 'author-info', 'tags', 'comment-section', 'related-posts']
        },
        {
          id: 'admin',
          type: 'form',
          title: 'Admin',
          components: ['editor', 'title-input', 'category-selector', 'tag-input', 'publish-button', 'draft-button']
        }
      ],
      data_models: [
        {
          name: 'Post',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'title', type: 'string', required: true },
            { name: 'slug', type: 'string', required: true },
            { name: 'content', type: 'text', required: true },
            { name: 'excerpt', type: 'string', required: false },
            { name: 'author_id', type: 'string', required: true },
            { name: 'category', type: 'string', required: true },
            { name: 'tags', type: 'array', required: false },
            { name: 'status', type: 'string', required: true },
            { name: 'published_at', type: 'timestamp', required: false }
          ]
        },
        {
          name: 'Comment',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'post_id', type: 'string', required: true },
            { name: 'user_id', type: 'string', required: true },
            { name: 'content', type: 'text', required: true },
            { name: 'approved', type: 'boolean', required: true },
            { name: 'created_at', type: 'timestamp', required: true }
          ]
        }
      ],
      actions: [
        {
          name: 'PublishPost',
          triggers: ['button.click'],
          steps: ['validate_content', 'generate_slug', 'update_status', 'navigate.post']
        },
        {
          name: 'AddComment',
          triggers: ['form.submit'],
          steps: ['validate_comment', 'insert_record', 'send_notification', 'refresh_comments']
        },
        {
          name: 'FilterByCategory',
          triggers: ['category.click'],
          steps: ['query_posts', 'update_grid']
        }
      ]
    },
    smpl: `APP(BlogCraft){
  pages:
    home[feed]: navbar,post-grid,category-filter,search
    post[detail]: post-header,post-content,author-info,tags,comment-section,related-posts
    admin[form]: editor,title-input,category-selector,tag-input,publish-button,draft-button
  models:
    Post: id:string!, title:string!, slug:string!, content:text!, excerpt:string, author_id:string!, category:string!, tags:array, status:string!, published_at:timestamp
    Comment: id:string!, post_id:string!, user_id:string!, content:text!, approved:boolean!, created_at:timestamp!
  actions:
    PublishPost: button.click -> validate_content > generate_slug > update_status > navigate.post
    AddComment: form.submit -> validate_comment > insert_record > send_notification > refresh_comments
    FilterByCategory: category.click -> query_posts > update_grid
}`
  },
  {
    id: 'ecommerce-product',
    title: 'E-commerce Product Page',
    description: 'A product catalog with cart, checkout, and order management',
    natural: `Create an e-commerce product page with:
- Product grid showing images, titles, and prices
- Product detail page with image gallery, description, and reviews
- Add to cart functionality
- Shopping cart with quantity adjustment
- Simple checkout form
- Order confirmation page`,
    json: {
      app_name: 'ShopStream',
      platform: 'web',
      description: 'An e-commerce platform for browsing and purchasing products',
      pages: [
        {
          id: 'catalog',
          type: 'feed',
          title: 'Catalog',
          components: ['navbar', 'product-grid', 'filter-sidebar', 'cart-icon']
        },
        {
          id: 'product',
          type: 'detail',
          title: 'Product',
          components: ['image-gallery', 'product-info', 'price', 'add-to-cart', 'reviews', 'related-products']
        },
        {
          id: 'cart',
          type: 'detail',
          title: 'Cart',
          components: ['cart-items', 'quantity-controls', 'subtotal', 'checkout-button']
        },
        {
          id: 'checkout',
          type: 'form',
          title: 'Checkout',
          components: ['shipping-form', 'payment-form', 'order-summary', 'place-order-button']
        }
      ],
      data_models: [
        {
          name: 'Product',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'name', type: 'string', required: true },
            { name: 'description', type: 'text', required: true },
            { name: 'price', type: 'number', required: true },
            { name: 'images', type: 'array', required: true },
            { name: 'category', type: 'string', required: true },
            { name: 'stock', type: 'number', required: true }
          ]
        },
        {
          name: 'CartItem',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'product_id', type: 'string', required: true },
            { name: 'quantity', type: 'number', required: true },
            { name: 'user_id', type: 'string', required: true }
          ]
        },
        {
          name: 'Order',
          fields: [
            { name: 'id', type: 'string', required: true },
            { name: 'user_id', type: 'string', required: true },
            { name: 'items', type: 'array', required: true },
            { name: 'total', type: 'number', required: true },
            { name: 'status', type: 'string', required: true },
            { name: 'created_at', type: 'timestamp', required: true }
          ]
        }
      ],
      actions: [
        {
          name: 'AddToCart',
          triggers: ['button.click'],
          steps: ['check_stock', 'insert_cart_item', 'update_cart_count', 'show_notification']
        },
        {
          name: 'UpdateQuantity',
          triggers: ['quantity.change'],
          steps: ['validate_stock', 'update_record', 'recalculate_total']
        },
        {
          name: 'PlaceOrder',
          triggers: ['form.submit'],
          steps: ['validate_payment', 'create_order', 'clear_cart', 'navigate.confirmation']
        }
      ]
    },
    smpl: `APP(ShopStream){
  pages:
    catalog[feed]: navbar,product-grid,filter-sidebar,cart-icon
    product[detail]: image-gallery,product-info,price,add-to-cart,reviews,related-products
    cart[detail]: cart-items,quantity-controls,subtotal,checkout-button
    checkout[form]: shipping-form,payment-form,order-summary,place-order-button
  models:
    Product: id:string!, name:string!, description:text!, price:number!, images:array!, category:string!, stock:number!
    CartItem: id:string!, product_id:string!, quantity:number!, user_id:string!
    Order: id:string!, user_id:string!, items:array!, total:number!, status:string!, created_at:timestamp!
  actions:
    AddToCart: button.click -> check_stock > insert_cart_item > update_cart_count > show_notification
    UpdateQuantity: quantity.change -> validate_stock > update_record > recalculate_total
    PlaceOrder: form.submit -> validate_payment > create_order > clear_cart > navigate.confirmation
}`
  }
];
