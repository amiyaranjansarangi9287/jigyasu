# 2G Optimization Testing Guide

## Overview

This guide provides comprehensive instructions for testing Jigyasu's 2G optimization features to ensure the platform works reliably on slow connections.

## Understanding 2G Networks

### 2G Network Characteristics

| Metric | 2G | 3G | 4G |
|--------|-----|-----|-----|
| Download Speed | 0.1-0.3 Mbps | 0.4-14 Mbps | 5-100 Mbps |
| Upload Speed | 0.05-0.15 Mbps | 0.1-5.8 Mbps | 2-50 Mbps |
| Latency | 300-1000ms | 100-500ms | 50-100ms |
| Packet Loss | 5-10% | 1-5% | <1% |
| Jitter | 100-200ms | 50-100ms | 10-50ms |

### 2G User Experience Challenges

- Slow page loads
- Timeouts
- Intermittent connectivity
- High latency
- Packet loss
- Connection drops

## Testing Environment Setup

### 1. Network Simulation

#### Chrome DevTools

```
1. Open Chrome DevTools (F12)
2. Go to Network tab
3. Click "Network Throttling" dropdown
4. Select "Slow 3G" or "Custom"
5. For custom 2G:
   - Download: 250 Kbps
   - Upload: 50 Kbps
   - Latency: 300ms
```

#### Firefox DevTools

```
1. Open Firefox DevTools (F12)
2. Go to Network tab
3. Click "Throttling" dropdown
4. Select "Custom"
5. Configure 2G parameters
```

#### Charles Proxy

```
1. Install Charles Proxy
2. Go to Proxy > Throttle Settings
3. Enable bandwidth throttling
4. Set 2G parameters:
   - Download: 250 Kbps
   - Upload: 50 Kbps
   - Latency: 300ms
   - MTU: 1500
```

#### Network Link Conditioner (macOS)

```
1. Install Network Link Conditioner
2. Enable 2G profile
3. Adjust parameters as needed
```

### 2. Device Simulation

#### Android Emulator

```bash
# Set network speed
adb shell settings put global network_preference 1

# Set network type
adb shell service call connectivity 33 i32 2
```

#### iOS Simulator

```
1. Open iOS Simulator
2. Features > Network Conditioner
3. Select 2G profile
```

## Test Scenarios

### Scenario 1: Initial Load on 2G

**Objective:** Verify app loads within acceptable time on 2G

**Steps:**
1. Clear browser cache
2. Enable 2G throttling
3. Navigate to jigyasu.app
4. Measure time to first contentful paint
5. Measure time to interactive
6. Verify all critical assets load

**Success Criteria:**
- First contentful paint < 5s
- Time to interactive < 8s
- No timeout errors
- All critical UI elements visible

**Metrics to Record:**
- Total load time
- Number of requests
- Total data transferred
- Failed requests
- Timeouts

---

### Scenario 2: Module Loading on 2G

**Objective:** Verify Wonder-First modules load correctly on 2G

**Steps:**
1. Enable 2G throttling
2. Navigate to a Wonder-First module
3. Measure load time for each phase
4. Verify images load progressively
5. Verify animations are disabled
6. Verify content is readable

**Success Criteria:**
- Module loads within 10s
- Images load progressively
- Animations disabled on 2G
- No broken images
- Content readable before full load

**Metrics to Record:**
- Module load time
- Image load times
- Animation status
- Progressive loading behavior

---

### Scenario 3: Intermittent Connectivity

**Objective:** Verify app handles connection drops gracefully

**Steps:**
1. Enable 2G throttling
2. Start loading a module
3. Disable network at 50% load
4. Re-enable network after 5s
5. Verify app recovers
6. Verify progress is saved

**Success Criteria:**
- App shows loading indicator
- No crash on network drop
- Progress saved locally
- App resumes when network returns
- User can continue from where they left

**Metrics to Record:**
- Recovery time
- Data loss
- Error messages shown
- User experience rating

---

### Scenario 4: High Latency

**Objective:** Verify app handles high latency (500ms+) gracefully

**Steps:**
1. Set latency to 500ms
2. Navigate through app
3. Test interactive elements (buttons, forms)
4. Verify feedback is provided
5. Verify no double-submissions

**Success Criteria:**
- Loading indicators shown
- Buttons disable during action
- No double-submissions
- Clear feedback for all actions
- Timeout handling works

**Metrics to Record:**
- Perceived responsiveness
- Button click response time
- Form submission time
- Timeout occurrences

---

### Scenario 5: Packet Loss

**Objective:** Verify app handles packet loss (5-10%)

**Steps:**
1. Set packet loss to 5%
2. Navigate through app
3. Load a module
4. Verify retries work
5. Verify no data corruption

**Success Criteria:**
- Automatic retries work
- Failed requests are retried
- No data corruption
- User informed of issues
- App remains functional

**Metrics to Record:**
- Retry count
- Failed requests
- Data integrity
- User notifications

---

### Scenario 6: Offline to Online Transition

**Objective:** Verify app works offline and syncs when online

**Steps:**
1. Load app with good connection
2. Navigate to a module
3. Enable airplane mode
4. Complete the module
5. Disable airplane mode
6. Verify progress syncs

**Success Criteria:**
- App works offline after initial load
- Progress saves locally
- No errors when offline
- Progress syncs when online
- No data loss

**Metrics to Record:**
- Offline functionality
- Sync time
- Data integrity
- Conflict resolution

---

### Scenario 7: Low-Bandwidth Image Loading

**Objective:** Verify images load appropriately on 2G

**Steps:**
1. Enable 2G throttling
2. Navigate to module with images
3. Observe image loading behavior
4. Verify progressive loading
5. Verify low-res versions used

**Success Criteria:**
- Images load progressively
- Low-res versions used on 2G
- No broken images
- Images don't block content
- Alt text shown during load

**Metrics to Record:**
- Image load times
- Progressive loading behavior
- Image sizes
- Bandwidth used

---

### Scenario 8: Font Loading on 2G

**Objective:** Verify fonts load correctly on 2G

**Steps:**
1. Enable 2G throttling
2. Clear font cache
3. Navigate to app
4. Observe font loading
5. Verify fallback fonts work

**Success Criteria:**
- System fonts used as fallback
- No flash of unstyled text (FOUT)
- Text readable during font load
- Fonts load progressively
- No layout shifts

**Metrics to Record:**
- Font load time
- Fallback behavior
- Layout shifts
- Text readability

---

### Scenario 9: JavaScript Bundle Loading

**Objective:** Verify JavaScript loads efficiently on 2G

**Steps:**
1. Enable 2G throttling
2. Clear cache
3. Navigate to app
4. Monitor bundle loading
5. Verify code splitting works

**Success Criteria:**
- Bundles load progressively
- Critical JS loads first
- Non-critical JS lazy-loaded
- No blocking scripts
- App functional before full load

**Metrics to Record:**
- Bundle sizes
- Load order
- Blocking time
- Time to interactive

---

### Scenario 10: Shared Device Mode on 2G

**Objective:** Verify shared device mode works on 2G

**Steps:**
1. Enable 2G throttling
2. Create multiple profiles
3. Switch between profiles
4. Complete modules with different profiles
5. Verify data isolation

**Success Criteria:**
- Profile switching works
- Progress saved per profile
- No data leakage
- Switching is fast enough
- No conflicts

**Metrics to Record:**
- Switch time
- Data integrity
- Conflict occurrences
- User experience

## Performance Benchmarks

### Load Time Benchmarks (2G)

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Initial Load | 5s | 8s | 15s |
| Module Load | 10s | 15s | 25s |
| Image Load | 3s | 5s | 10s |
| Font Load | 2s | 3s | 5s |
| API Call | 2s | 4s | 8s |

### Bandwidth Benchmarks

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Initial Load Data | 500KB | 750KB | 1MB |
| Module Data | 300KB | 500KB | 750KB |
| Per Image | 50KB | 100KB | 200KB |
| Per Font | 30KB | 50KB | 100KB |

### Reliability Benchmarks

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Success Rate | 95% | 90% | 80% |
| Retry Success | 90% | 80% | 70% |
| Offline Success | 100% | 95% | 90% |
| Data Integrity | 100% | 99% | 95% |

## Testing Tools

### Network Simulation Tools

- **Chrome DevTools**: Built-in network throttling
- **Firefox DevTools**: Network throttling
- **Charles Proxy**: Advanced network simulation
- **Network Link Conditioner**: macOS network simulation
- **Clumsy**: Windows network simulation

### Monitoring Tools

- **Chrome DevTools Performance**: Performance profiling
- **Lighthouse**: Performance auditing
- **WebPageTest**: Real-world performance testing
- **Speedometer**: Browser performance benchmarking

### Automated Testing

```javascript
// 2G simulation in Playwright
test('module loads on 2G', async ({ page, context }) => {
  // Simulate 2G network
  await context.route('**/*', route => {
    route.fulfill({
      status: 200,
      body: route.request().postData(),
      headers: { 'content-type': 'application/json' }
    });
  });

  // Set slow network
  await page.emulateNetworkConditions({
    offline: false,
    downloadThroughput: 250 * 1024, // 250 Kbps
    uploadThroughput: 50 * 1024,    // 50 Kbps
    latency: 300                     // 300ms
  });

  // Test module load
  await page.goto('/lab/gravity-wonder');
  await expect(page.locator('text=Why don\'t we fly off Earth?')).toBeVisible({ timeout: 10000 });
});
```

## Common Issues and Solutions

### Issue: Timeout Errors

**Cause:** Requests taking too long on 2G

**Solutions:**
1. Increase timeout values
2. Implement progressive loading
3. Use smaller initial payloads
4. Add loading indicators

### Issue: Images Not Loading

**Cause:** Images too large for 2G

**Solutions:**
1. Use WebP format
2. Implement responsive images
3. Use low-res versions on 2G
4. Lazy load images

### Issue: App Crashes

**Cause:** Memory issues or network errors

**Solutions:**
1. Add error boundaries
2. Implement graceful degradation
3. Add retry logic
4. Monitor memory usage

### Issue: Data Loss

**Cause:** Connection drops during save

**Solutions:**
1. Implement local storage
2. Add conflict resolution
3. Implement sync queue
4. Add data validation

## Reporting Results

### Test Report Template

```markdown
# 2G Optimization Test Report

**Test Date:** YYYY-MM-DD
**Tester:** Name
**Network Simulation:** Chrome DevTools (2G)
**Device:** [Device Name]

### Results Summary
- Total Scenarios: 10
- Passed: 8
- Failed: 2
- Blocked: 0

### Failed Scenarios
1. **Scenario 2: Module Loading**
   - Issue: Module load time exceeded 15s
   - Severity: High
   - Details: [details]
   - Screenshot: [attached]

2. **Scenario 7: Image Loading**
   - Issue: Images not loading progressively
   - Severity: Medium
   - Details: [details]
   - Screenshot: [attached]

### Performance Metrics
- Initial Load Time: 7.2s (target: 5s)
- Module Load Time: 12.5s (target: 10s)
- Total Data Transferred: 850KB (target: 500KB)
- Success Rate: 92% (target: 95%)

### Recommendations
1. Optimize image sizes
2. Implement better progressive loading
3. Increase timeout values
4. Add more loading indicators
```

## Continuous Testing

### Weekly Testing
- Test core user flows on 2G
- Monitor performance metrics
- Check for regressions

### Monthly Testing
- Full 2G test suite
- Test on real 2G connections
- Update benchmarks based on data

### Quarterly Testing
- Test on new devices
- Update simulation parameters
- Review and improve test scenarios

## Resources

### Documentation
- [Web.dev Performance](https://web.dev/performance/)
- [MDN Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/NetworkInformation)
- [W3C Performance Timeline](https://www.w3.org/TR/performance-timeline/)

### Tools
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)

---

*2G optimization testing should be integrated into the regular testing cycle. All releases must pass 2G testing before deployment. Last updated: May 2026*
