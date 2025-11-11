// 🎯 Async Thunks Practice - Hands-on Exercises
// Complete these exercises to master async operations with RTK

import React, { useState, useEffect } from 'react';
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// =============================================================================
// PRACTICE EXERCISE 1: Weather App with API Integration
// =============================================================================

// TODO: Create async thunk for fetching weather data
const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (city, { rejectWithValue }) => {
    try {
      // Simulate weather API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock weather data
      const weatherData = {
        city,
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 100),
        windSpeed: Math.floor(Math.random() * 20) + 5,
        lastUpdated: new Date().toISOString()
      };

      // Simulate occasional API failures
      if (Math.random() < 0.2) {
        throw new Error('Weather service unavailable');
      }

      return weatherData;
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        city,
        timestamp: new Date().toISOString()
      });
    }
  }
);

// TODO: Create weather slice with async thunk handling
const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    currentWeather: null,
    loading: false,
    error: null,
    searchHistory: []
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addToHistory: (state, action) => {
      const city = action.payload;
      if (!state.searchHistory.includes(city)) {
        state.searchHistory.unshift(city);
        // Keep only last 5 searches
        state.searchHistory = state.searchHistory.slice(0, 5);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload;
        state.searchHistory.unshift(action.payload.city);
        state.searchHistory = [...new Set(state.searchHistory)].slice(0, 5);
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// Weather App Component
function WeatherApp() {
  const dispatch = useDispatch();
  const { currentWeather, loading, error, searchHistory } = useSelector(state => state.weather);
  const [city, setCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      dispatch(fetchWeather(city.trim()));
      setCity('');
    }
  };

  const handleHistoryClick = (historicalCity) => {
    dispatch(fetchWeather(historicalCity));
  };

  return (
    <div className="weather-app">
      <h2>🌤️ Weather App</h2>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name..."
          disabled={loading}
          className="city-input"
        />
        <button type="submit" disabled={loading || !city.trim()} className="btn-primary">
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <span>❌ {error.message}</span>
          <button onClick={() => dispatch(weatherSlice.actions.clearError())}>×</button>
        </div>
      )}

      {currentWeather && (
        <div className="weather-display">
          <h3>Weather in {currentWeather.city}</h3>
          <div className="weather-info">
            <div className="weather-main">
              <span className="temperature">{currentWeather.temperature}°C</span>
              <span className="condition">{currentWeather.condition}</span>
            </div>
            <div className="weather-details">
              <div>Humidity: {currentWeather.humidity}%</div>
              <div>Wind: {currentWeather.windSpeed} km/h</div>
              <div>Updated: {new Date(currentWeather.lastUpdated).toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      )}

      {searchHistory.length > 0 && (
        <div className="search-history">
          <h4>Recent Searches:</h4>
          <div className="history-buttons">
            {searchHistory.map(historicalCity => (
              <button
                key={historicalCity}
                onClick={() => handleHistoryClick(historicalCity)}
                className="history-btn"
                disabled={loading}
              >
                {historicalCity}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// PRACTICE EXERCISE 2: News Feed with Infinite Scroll
// =============================================================================

// TODO: Create async thunk for fetching news articles
const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ page = 1, category = 'general', reset = false }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mock news data
      const articles = Array.from({ length: 10 }, (_, i) => ({
        id: `${category}_${page}_${i}`,
        title: `${category} News Article ${(page - 1) * 10 + i + 1}`,
        summary: `This is a summary of the ${category} news article...`,
        category,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        readTime: Math.floor(Math.random() * 10) + 2
      }));

      // Simulate occasional failures
      if (Math.random() < 0.1) {
        throw new Error('Failed to fetch news');
      }

      return {
        articles,
        page,
        hasMore: page < 5, // Simulate 5 pages max
        category,
        reset
      };
    } catch (error) {
      return rejectWithValue({
        message: error.message,
        page,
        category
      });
    }
  }
);

// TODO: Create news slice with pagination handling
const newsSlice = createSlice({
  name: 'news',
  initialState: {
    articles: [],
    categories: ['general', 'technology', 'sports', 'business'],
    currentCategory: 'general',
    pagination: {
      page: 1,
      hasMore: true
    },
    loading: false,
    error: null
  },
  reducers: {
    setCategory: (state, action) => {
      state.currentCategory = action.payload;
      state.articles = [];
      state.pagination = { page: 1, hasMore: true };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        const { articles, page, hasMore, reset } = action.payload;

        state.loading = false;

        if (reset) {
          state.articles = articles;
        } else {
          state.articles.push(...articles);
        }

        state.pagination = { page, hasMore };
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

// News Feed Component
function NewsFeed() {
  const dispatch = useDispatch();
  const {
    articles,
    categories,
    currentCategory,
    pagination,
    loading,
    error
  } = useSelector(state => state.news);

  useEffect(() => {
    dispatch(fetchNews({ page: 1, category: currentCategory, reset: true }));
  }, [dispatch, currentCategory]);

  const handleCategoryChange = (category) => {
    dispatch(newsSlice.actions.setCategory(category));
  };

  const handleLoadMore = () => {
    if (!loading && pagination.hasMore) {
      dispatch(fetchNews({
        page: pagination.page + 1,
        category: currentCategory,
        reset: false
      }));
    }
  };

  return (
    <div className="news-feed">
      <h2>📰 News Feed</h2>

      {/* Category Selector */}
      <div className="category-selector">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`category-btn ${currentCategory === category ? 'active' : ''}`}
            disabled={loading}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {error && (
        <div className="error-message">
          <span>❌ {error.message}</span>
          <button onClick={() => dispatch(newsSlice.actions.clearError())}>×</button>
        </div>
      )}

      {/* Articles */}
      <div className="articles-list">
        {articles.map(article => (
          <div key={article.id} className="article-card">
            <h3>{article.title}</h3>
            <p>{article.summary}</p>
            <div className="article-meta">
              <span>📂 {article.category}</span>
              <span>⏱️ {article.readTime} min read</span>
              <span>📅 {new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {pagination.hasMore && (
        <div className="load-more-section">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Loading More...' : 'Load More Articles'}
          </button>
        </div>
      )}

      {!pagination.hasMore && articles.length > 0 && (
        <div className="end-message">
          <p>You've read all the {currentCategory} news! 🎉</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// STORE AND MAIN APP
// =============================================================================

const practiceStore = configureStore({
  reducer: {
    weather: weatherSlice.reducer,
    news: newsSlice.reducer
  }
});

function AsyncThunksPractice() {
  const [activeExercise, setActiveExercise] = useState('weather');

  return (
    <Provider store={practiceStore}>
      <div className="practice-app">
        <header className="practice-header">
          <h1>🎯 Async Thunks Practice</h1>
          <p>Master async operations with real-world examples</p>

          <nav className="exercise-nav">
            <button
              onClick={() => setActiveExercise('weather')}
              className={activeExercise === 'weather' ? 'active' : ''}
            >
              🌤️ Weather App
            </button>
            <button
              onClick={() => setActiveExercise('news')}
              className={activeExercise === 'news' ? 'active' : ''}
            >
              📰 News Feed
            </button>
          </nav>
        </header>

        <main className="practice-content">
          {activeExercise === 'weather' && <WeatherApp />}
          {activeExercise === 'news' && <NewsFeed />}
        </main>

        <footer className="practice-summary">
          <h3>🎯 What You're Practicing:</h3>
          <div className="practice-points">
            <div className="practice-point">
              <h4>⚡ createAsyncThunk</h4>
              <p>Handling async operations with automatic state management</p>
            </div>
            <div className="practice-point">
              <h4>🔄 Loading States</h4>
              <p>Managing pending, fulfilled, and rejected states</p>
            </div>
            <div className="practice-point">
              <h4>🚨 Error Handling</h4>
              <p>Custom error payloads and user-friendly error messages</p>
            </div>
            <div className="practice-point">
              <h4>📄 Pagination</h4>
              <p>Loading more data with proper state management</p>
            </div>
          </div>
        </footer>
      </div>
    </Provider>
  );
}

export default AsyncThunksPractice;

// Basic styles for the practice exercises
const practiceStyles = `
.practice-app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%);
  padding: 2rem;
}

.practice-header {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.practice-header h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2.5rem;
}

.practice-header p {
  margin: 0 0 2rem 0;
  color: #666;
}

.exercise-nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.exercise-nav button {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  background: white;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 1rem;
}

.exercise-nav button:hover {
  border-color: #ff9a9e;
  background: #fff5f5;
}

.exercise-nav button.active {
  background: #ff9a9e;
  color: white;
  border-color: #ff9a9e;
}

.practice-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

/* Weather App Styles */
.weather-app {
  max-width: 600px;
  margin: 0 auto;
}

.search-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.city-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.city-input:focus {
  border-color: #ff9a9e;
  outline: none;
}

.weather-display {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-bottom: 2rem;
}

.weather-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
}

.weather-main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.temperature {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.condition {
  font-size: 1.2rem;
  opacity: 0.9;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.search-history {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.search-history h4 {
  margin: 0 0 1rem 0;
  color: #333;
}

.history-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.history-btn {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.history-btn:hover:not(:disabled) {
  background: #e3f2fd;
  border-color: #1976d2;
}

.history-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* News Feed Styles */
.news-feed {
  max-width: 800px;
  margin: 0 auto;
}

.category-selector {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  background: white;
  color: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: capitalize;
}

.category-btn:hover:not(:disabled) {
  border-color: #ff9a9e;
  background: #fff5f5;
}

.category-btn.active {
  background: #ff9a9e;
  color: white;
  border-color: #ff9a9e;
}

.category-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.article-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

.article-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.article-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.article-card p {
  margin: 0 0 1rem 0;
  color: #666;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: #888;
  flex-wrap: wrap;
}

.load-more-section {
  text-align: center;
  margin: 2rem 0;
}

.end-message {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}

/* Common Styles */
.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #fcc;
}

.btn-primary {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 154, 158, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.practice-summary {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.practice-summary h3 {
  text-align: center;
  margin: 0 0 2rem 0;
  color: #333;
}

.practice-points {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.practice-point {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.practice-point h4 {
  margin: 0 0 1rem 0;
  color: #ff9a9e;
}

.practice-point p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .practice-app {
    padding: 1rem;
  }
  
  .exercise-nav {
    flex-direction: column;
  }
  
  .search-form {
    flex-direction: column;
  }
  
  .weather-info {
    grid-template-columns: 1fr;
  }
  
  .category-selector {
    justify-content: center;
  }
  
  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .practice-points {
    grid-template-columns: 1fr;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = practiceStyles;
  document.head.appendChild(styleSheet);
}