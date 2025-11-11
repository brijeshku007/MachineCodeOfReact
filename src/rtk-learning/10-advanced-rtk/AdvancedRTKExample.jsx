import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  configureStore,
  createListenerMiddleware
} from '@reduxjs/toolkit'
import { Provider, useSelector, useDispatch } from 'react-redux'

// 🚀 This component demonstrates advanced RTK patterns and expert-level techniques
// Real-time updates, performance monitoring, custom hooks, and advanced optimizations

// 📊 Performance Monitor Utility
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = new Set()
  }

  start(key) {
    this.metrics.set(key, {
      start: performance.now(),
      memory: performance.memory?.usedJSHeapSize || 0
    })
  }

  end(key) {
    const metric = this.metrics.get(key)
    if (metric) {
      const end = performance.now()
      const duration = end - metric.start
      const memoryDelta = (performance.memory?.usedJSHeapSize || 0) - metric.memory

      const result = {
        key,
        duration,
        memoryDelta,
        timestamp: new Date().toISOString()
      }

      // Notify observers
      this.observers.forEach(observer => observer(result))

      // Log slow operations
      if (duration > 50) {
        console.warn(`🐌 Slow operation: ${key} took ${duration.toFixed(2)}ms`)
      }

      return result
    }
  }

  subscribe(observer) {
    this.observers.add(observer)
    return () => this.observers.delete(observer)
  }

  getMetrics() {
    return Array.from(this.metrics.entries())
  }
}

const performanceMonitor = new PerformanceMonitor()

// 🔄 Advanced Cache Manager
class AdvancedCacheManager {
  constructor(options = {}) {
    this.memoryCache = new Map()
    this.maxSize = options.maxSize || 100
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000 // 5 minutes
  }

  set(key, value, ttl = this.defaultTTL) {
    // Implement LRU eviction
    if (this.memoryCache.size >= this.maxSize) {
      const firstKey = this.memoryCache.keys().next().value
      this.memoryCache.delete(firstKey)
    }

    this.memoryCache.set(key, {
      value,
      expires: Date.now() + ttl,
      accessed: Date.now()
    })
  }

  get(key) {
    const item = this.memoryCache.get(key)
    if (!item) return null

    if (item.expires < Date.now()) {
      this.memoryCache.delete(key)
      return null
    }

    // Update access time for LRU
    item.accessed = Date.now()
    return item.value
  }

  clear() {
    this.memoryCache.clear()
  }

  getStats() {
    return {
      size: this.memoryCache.size,
      maxSize: this.maxSize,
      hitRate: this.hitRate || 0
    }
  }
} c
onst cacheManager = new AdvancedCacheManager()

// 🌊 Real-time Data Simulator
class RealtimeDataSimulator {
  constructor() {
    this.subscribers = new Set()
    this.isRunning = false
    this.interval = null
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.interval = setInterval(() => {
      const data = {
        timestamp: Date.now(),
        metrics: {
          activeUsers: Math.floor(Math.random() * 1000) + 500,
          revenue: Math.floor(Math.random() * 10000) + 50000,
          orders: Math.floor(Math.random() * 50) + 20,
          performance: Math.random() * 100,
        },
        events: [
          { type: 'user_joined', userId: Math.floor(Math.random() * 1000) },
          { type: 'order_placed', orderId: Math.floor(Math.random() * 10000) },
          { type: 'payment_processed', amount: Math.floor(Math.random() * 500) + 50 },
        ][Math.floor(Math.random() * 3)]
      }

      this.subscribers.forEach(callback => callback(data))
    }, 2000) // Update every 2 seconds
  }

  stop() {
    this.isRunning = false
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
}

const realtimeSimulator = new RealtimeDataSimulator()

  // 🔄 Advanced     
  < div className = "filter-group" >
          <label>Sort By:</label>
          <select
            value={uiState.sortBy}
            onChange={(e) => dispatch(setUIState({ sortBy: e.target.value }))}
          >
            <option val    
    <div className="filter-group">
          <label>Sort By:</label>
          <select
            value={uiState.sortBy}
            onChange={(e) => dispatch(setUIState({ sortBy: e.target.value }))}
          >
            <option value="name">Name</option>
            <option value="value">Value</option>
            <option value="category">Category</option>
          </select>
          <button
            onClick={() => dispatch(setUIState({ 
              sortOrder: uiState.sortOrder === 'asc' ? 'desc' : 'asc' 
            }))}
            className="sort-order-btn"
          >
            {uiState.sortOrder === 'asc' ? '⬆️' : '⬇️'}
          </button>
        </div>

        <button onClick={clearAllFilters} className="clear-filters-btn">
          🗑️ Clear All Filters
        </button>
      </div>

{/* Results Info */ }
<div className="results-info">
  <span>Showing {itemCount} items</span>
  {metadata && (
    <span>• Last updated: {new Date(metadata.fetchTime).toLocaleTimeString()}</span>
  )}
  <div className="view-controls">
    <button
      onClick={() => dispatch(setUIState({ viewMode: 'grid' }))}
      className={`view-btn ${uiState.viewMode === 'grid' ? 'active' : ''}`}
    >
      ⊞ Grid
    </button>
    <button
      onClick={() => dispatch(setUIState({ viewMode: 'list' }))}
      className={`view-btn ${uiState.viewMode === 'list' ? 'active' : ''}`}
    >
      ☰ List
    </button>
  </div>
</div>

{/* Selection Controls */ }
{
  filteredItems.length > 0 && (
    <div className="selection-controls">
      <button
        onClick={() => dispatch(selectAllItems())}
        disabled={uiState.selectedItems.length === filteredItems.length}
      >
        ✅ Select All
      </button>
      <button
        onClick={() => dispatch(clearSelection())}
        disabled={uiState.selectedItems.length === 0}
      >
        ❌ Clear Selection
      </button>
      <span className="selection-count">
        {uiState.selectedItems.length} selected
      </span>
    </div>
  )
}

{/* Error Display */ }
{
  error && (
    <div className="error-display">
      <h4>❌ Error</h4>
      <p>{error.message}</p>
      <p>Retry count: {error.retryCount}</p>
      <button onClick={handleLoadData}>🔄 Retry</button>
    </div>
  )
}

{/* Data Grid/List */ }
<div className={`data-container ${uiState.viewMode}`}>
  {filteredItems.map(item => (
    <AdvancedDataItem
      key={item.id}
      item={item}
      isSelected={uiState.selectedItems.includes(item.id)}
      onToggleSelection={() => dispatch(toggleItemSelection(item.id))}
      viewMode={uiState.viewMode}
    />
  ))}
</div>

{
  filteredItems.length === 0 && !loading && (
    <div className="no-data">
      <p>No items found matching your criteria.</p>
    </div>
  )
}
    </div >
  )
})

// 🃏 Advanced Data Item Component
const AdvancedDataItem = React.memo(({ item, isSelected, onToggleSelection, viewMode }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(item.value)
  const dispatch = useDispatch()

  const handleSave = useCallback(() => {
    if (editValue !== item.value) {
      dispatch(bulkUpdateItems({
        ids: [item.id],
        updates: { value: parseInt(editValue) }
      }))
    }
    setIsEditing(false)
  }, [dispatch, item.id, editValue, item.value])

  const getCategoryColor = (category) => {
    const colors = { A: '#ff6b6b', B: '#4ecdc4', C: '#45b7d1' }
    return colors[category] || '#666'
  }

  if (viewMode === 'list') {
    return (
      <div className={`data-item list-view ${isSelected ? 'selected' : ''}`}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
        />
        <span className="item-id">#{item.id}</span>
        <span className="item-name">{item.name}</span>
        <span
          className="item-category"
          style={{ color: getCategoryColor(item.category) }}
        >
          {item.category}
        </span>
        <span className="item-value">
          {isEditing ? (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          ) : (
            <span onClick={() => setIsEditing(true)}>{item.value}</span>
          )}
        </span>
        <span className="item-timestamp">
          {new Date(item.timestamp).toLocaleTimeString()}
        </span>
      </div>
    )
  }

  return (
    <div className={`data-item grid-view ${isSelected ? 'selected' : ''}`}>
      <div className="item-header">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
        />
        <span className="item-id">#{item.id}</span>
      </div>

      <h4 className="item-name">{item.name}</h4>

      <div className="item-details">
        <div
          className="item-category"
          style={{ backgroundColor: getCategoryColor(item.category) }}
        >
          {item.category}
        </div>
        <div className="item-value">
          {isEditing ? (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          ) : (
            <span onClick={() => setIsEditing(true)}>{item.value}</span>
          )}
        </div>
      </div>

      <div className="item-timestamp">
        {new Date(item.timestamp).toLocaleString()}
      </div>
    </div>
  )
})

// 🎯 Main Advanced RTK Example Component
function AdvancedRTKExample() {
  const [activeTab, setActiveTab] = useState('explorer')

  const tabs = [
    { id: 'explorer', label: '🔍 Data Explorer', component: AdvancedDataExplorer },
    { id: 'performance', label: '📊 Performance', component: PerformanceDashboard },
    { id: 'realtime', label: '🌊 Real-time', component: RealtimeDashboard },
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="advanced-rtk-example">
      <div className="header">
        <h1>🚀 Advanced RTK Mastery</h1>
        <p>Expert-level patterns, performance monitoring, and real-time features</p>
      </div>

      <div className="navigation">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="main-content">
        {ActiveComponent && <ActiveComponent />}
      </div>

      <div className="advanced-features-info">
        <h3>🚀 Advanced RTK Features Demonstrated:</h3>
        <div className="features-grid">
          <div className="feature-category">
            <h4>⚡ Performance Optimization</h4>
            <ul>
              <li>✅ Real-time performance monitoring</li>
              <li>✅ Memory usage tracking</li>
              <li>✅ Operation duration analysis</li>
              <li>✅ Advanced caching strategies</li>
              <li>✅ Memoized selectors with deep equality</li>
            </ul>
          </div>

          <div className="feature-category">
            <h4>🌊 Real-time Features</h4>
            <ul>
              <li>✅ Live data streaming simulation</li>
              <li>✅ WebSocket-like updates</li>
              <li>✅ Event-driven architecture</li>
              <li>✅ Connection state management</li>
              <li>✅ Automatic reconnection handling</li>
            </ul>
          </div>

          <div className="feature-category">
            <h4>🎯 Advanced State Management</h4>
            <ul>
              <li>✅ Complex entity relationships</li>
              <li>✅ Multi-level filtering and sorting</li>
              <li>✅ Bulk operations with optimistic updates</li>
              <li>✅ Advanced error handling with retry logic</li>
              <li>✅ Custom middleware and listeners</li>
            </ul>
          </div>

          <div className="feature-category">
            <h4>🛠️ Expert Patterns</h4>
            <ul>
              <li>✅ Custom hooks for complex operations</li>
              <li>✅ Factory selectors and memoization</li>
              <li>✅ Performance monitoring utilities</li>
              <li>✅ Advanced caching mechanisms</li>
              <li>✅ Scalable architecture patterns</li>
            </ul>
          </div>
        </div>

        <div className="mastery-summary">
          <h4>🎉 RTK Mastery Complete!</h4>
          <p>
            You've now mastered all aspects of Redux Toolkit, from basic concepts to expert-level patterns.
            You can build scalable, performant applications and lead technical teams in RTK implementation.
          </p>
          <div className="next-steps">
            <h5>🚀 What's Next?</h5>
            <ul>
              <li>Apply these patterns in production applications</li>
              <li>Mentor other developers in RTK best practices</li>
              <li>Contribute to open source RTK projects</li>
              <li>Create custom RTK utilities and abstractions</li>
              <li>Lead architectural decisions in your team</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .advanced-rtk-example {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px;
        }

        .header h1 {
          margin: 0 0 10px 0;
          font-size: 2.5rem;
        }

        .header p {
          margin: 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }

        .navigation {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #e1e5e9;
        }

        .nav-tab {
          padding: 12px 24px;
          border: none;
          background: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          color: #666;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }

        .nav-tab:hover {
          color: #333;
          background: #f8f9fa;
        }

        .nav-tab.active {
          color: #667eea;
          border-bottom-color: #667eea;
          background: #f8f9fa;
        }

        .main-content {
          min-height: 600px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          padding: 30px;
          margin-bottom: 40px;
        }

        /* Performance Dashboard Styles */
        .performance-dashboard h3,
        .realtime-dashboard h3,
        .advanced-data-explorer h3 {
          margin-top: 0;
          color: #333;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 2px solid #e1e5e9;
        }

        .monitor-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .monitor-btn.active {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
        }

        .performance-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
        }

        .cache-stats {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .cache-stats h4 {
          margin-top: 0;
          color: #333;
        }

        .cache-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          font-size: 0.9rem;
          color: #666;
        }

        .recent-metrics {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .recent-metrics h4 {
          margin-top: 0;
          color: #333;
        }

        .metrics-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .metric-item {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 15px;
          padding: 8px;
          background: white;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .metric-key {
          font-weight: 500;
          color: #333;
        }

        .metric-duration {
          color: #666;
        }

        .metric-time {
          color: #999;
        }

        /* Real-time Dashboard Styles */
        .connection-controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .connection-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .connection-status.connected {
          background: #e8f5e8;
          color: #2e7d32;
        }

        .connection-status.disconnected {
          background: #ffebee;
          color: #c62828;
        }

        .connection-btn {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .connection-btn:hover {
          background: #f0f0f0;
        }

        .realtime-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #4caf50;
        }

        .metric-icon {
          font-size: 2rem;
        }

        .metric-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #333;
        }

        .metric-label {
          color: #666;
          font-size: 0.9rem;
        }

        .realtime-events {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .realtime-events h4 {
          margin-top: 0;
          color: #333;
        }

        .events-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .event-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: white;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .event-type {
          font-weight: 500;
          color: #333;
          text-transform: capitalize;
        }

        .event-details {
          color: #666;
        }

        /* Data Explorer Styles */
        .explorer-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .header-actions button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .header-actions button:hover:not(:disabled) {
          background: #f0f0f0;
        }

        .header-actions button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .bulk-update-btn:hover:not(:disabled) {
          background: #e3f2fd;
          border-color: #2196f3;
        }

        .bulk-delete-btn:hover:not(:disabled) {
          background: #ffebee;
          border-color: #f44336;
          color: #f44336;
        }

        .advanced-filters {
          display: flex;
          gap: 20px;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-group label {
          font-weight: 500;
          color: #333;
          white-space: nowrap;
        }

        .filter-group select,
        .filter-group input {
          padding: 6px 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }

        .sort-order-btn {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.8rem;
        }

        .clear-filters-btn {
          padding: 6px 12px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .clear-filters-btn:hover {
          background: #d32f2f;
        }

        .results-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          padding: 10px 0;
          border-bottom: 1px solid #e1e5e9;
          flex-wrap: wrap;
          gap: 15px;
        }

        .view-controls {
          display: flex;
          gap: 5px;
        }

        .view-btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.85rem;
          transition: all 0.2s ease;
        }

        .view-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .selection-controls {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 20px;
          padding: 10px;
          background: #e3f2fd;
          border-radius: 6px;
        }

        .selection-controls button {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .selection-controls button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .selection-count {
          margin-left: auto;
          font-weight: 500;
          color: #1976d2;
        }

        .error-display {
          background: #ffebee;
          border: 1px solid #f44336;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .error-display h4 {
          margin-top: 0;
          color: #f44336;
        }

        .error-display button {
          margin-top: 10px;
          padding: 8px 16px;
          background: #f44336;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .data-container.grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }

        .data-container.list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .data-item {
          border: 1px solid #e1e5e9;
          border-radius: 8px;
          padding: 15px;
          background: #fafbfc;
          transition: all 0.2s ease;
        }

        .data-item:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .data-item.selected {
          border-color: #667eea;
          background: #f3f4ff;
        }

        .data-item.grid-view {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .data-item.list-view {
          display: grid;
          grid-template-columns: auto auto 1fr auto auto auto;
          gap: 15px;
          align-items: center;
          padding: 10px 15px;
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-id {
          font-size: 0.8rem;
          color: #666;
          font-weight: 500;
        }

        .item-name {
          margin: 0;
          color: #333;
          font-size: 1.1rem;
        }

        .item-details {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .item-category {
          padding: 4px 8px;
          border-radius: 12px;
          color: white;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .item-value {
          font-size: 1.2rem;
          font-weight: bold;
          color: #4caf50;
          cursor: pointer;
        }

        .item-value input {
          width: 80px;
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: bold;
        }

        .item-timestamp {
          font-size: 0.8rem;
          color: #999;
        }

        .no-data {
          text-align: center;
          padding: 60px;
          color: #666;
          font-style: italic;
        }

        /* Advanced Features Info */
        .advanced-features-info {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 30px;
        }

        .advanced-features-info h3 {
          margin-top: 0;
          color: #333;
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .feature-category {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .feature-category h4 {
          margin-top: 0;
          color: #667eea;
          border-bottom: 2px solid #e1e5e9;
          padding-bottom: 10px;
        }

        .feature-category ul {
          list-style: none;
          padding: 0;
        }

        .feature-category li {
          padding: 5px 0;
          color: #666;
        }

        .mastery-summary {
          background: white;
          border-radius: 8px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          text-align: center;
        }

        .mastery-summary h4 {
          margin-top: 0;
          color: #4caf50;
          font-size: 1.5rem;
        }

        .mastery-summary p {
          color: #666;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .next-steps {
          text-align: left;
          max-width: 600px;
          margin: 0 auto;
        }

        .next-steps h5 {
          color: #333;
          margin-bottom: 15px;
        }

        .next-steps ul {
          color: #666;
          line-height: 1.6;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: 1fr;
          }

          .advanced-filters {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .data-container.grid {
            grid-template-columns: 1fr;
          }

          .data-item.list-view {
            grid-template-columns: auto 1fr auto;
            gap: 10px;
          }
        }

        @media (max-width: 768px) {
          .advanced-rtk-example {
            padding: 10px;
          }

          .header h1 {
            font-size: 2rem;
          }

          .navigation {
            flex-wrap: wrap;
          }

          .nav-tab {
            flex: 1;
            min-width: 120px;
          }

          .main-content {
            padding: 20px;
          }

          .explorer-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: flex-start;
          }

          .results-info {
            flex-direction: column;
            align-items: flex-start;
          }

          .performance-stats,
          .realtime-metrics {
            grid-template-columns: 1fr;
          }

          .dashboard-header {
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  )
}

// 🎯 Main App Component with Provider
export default function AdvancedRTKApp() {
  return (
    <Provider store={store}>
      <AdvancedRTKExample />
    </Provider>
  )
}