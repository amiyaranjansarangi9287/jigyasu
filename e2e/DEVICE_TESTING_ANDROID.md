# Low-End Android Device Testing Guide

## Overview

This guide provides instructions for testing Jigyasu on low-end Android devices to ensure accessibility for learners with limited hardware.

## Target Device Specifications

### Minimum Requirements
- **RAM**: 1GB (tested), 2GB (recommended)
- **Storage**: 8GB (tested), 16GB (recommended)
- **Android Version**: 5.0 (Lollipop) and above
- **Screen Size**: 4.5" - 5.5"
- **Processor**: Quad-core 1.2GHz or equivalent
- **Network**: 2G/3G capable

### Test Devices

| Device | RAM | Storage | Android | Notes |
|--------|-----|---------|---------|-------|
| Samsung Galaxy J2 | 1.5GB | 8GB | 5.1 | Baseline device |
| Redmi 4A | 2GB | 16GB | 6.0 | Common budget phone |
| Nokia 2 | 1GB | 8GB | 8.1 | Android Go device |
| Moto E5 Play | 2GB | 16GB | 8.0 | US market equivalent |
| Micromax Bharat 5 | 2GB | 16GB | 7.0 | Indian market device |

## Testing Setup

### 1. Device Preparation

```bash
# Enable Developer Options
# Settings > About Phone > Tap "Build Number" 7 times

# Enable USB Debugging
# Settings > Developer Options > USB Debugging

# Enable Stay Awake
# Settings > Developer Options > Stay Awake (keeps screen on during testing)

# Disable Auto-Update
# Play Store > Settings > Auto-update apps > Do not auto-update apps
```

### 2. Network Simulation

```bash
# Use Android's built-in network throttling
# Settings > Developer Options > Network Profile
# Options: 2G, 3G, 4G, LTE

# Or use ADB commands
adb shell settings put global airplane_mode_on 1
adb shell settings put global airplane_mode_on 0

# Set preferred network type
adb shell service call connectivity 33 i32 0
```

### 3. Storage Management

```bash
# Check available storage
adb shell df -h

# Clear app cache
adb shell pm clear com.jigyasu.app

# Monitor storage usage
adb shell dumpsys diskstats
```

## Test Scenarios

### Scenario 1: Initial Installation

**Steps:**
1. Clear all data from previous installation
2. Install fresh APK
3. Measure installation time
4. Check storage usage after installation
5. Verify app launches successfully

**Success Criteria:**
- Installation completes within 2 minutes
- App size < 50MB
- App launches within 10 seconds
- No crashes during first launch

---

### Scenario 2: 2G Network Performance

**Steps:**
1. Set network profile to 2G
2. Clear app cache
3. Launch app
4. Navigate to a Wonder-First module
5. Complete the module
6. Measure load times at each phase

**Success Criteria:**
- App loads within 5 seconds
- Module loads within 10 seconds
- Phase transitions complete within 3 seconds
- No timeout errors
- Progress saves correctly

---

### Scenario 3: Memory Pressure

**Steps:**
1. Open multiple apps in background (browser, WhatsApp, camera)
2. Launch Jigyasu
3. Navigate through 3 modules
4. Check for memory warnings
5. Verify no crashes or data loss

**Success Criteria:**
- No "App not responding" errors
- No force closes
- Progress saves correctly
- App remains responsive

---

### Scenario 4: Storage Constraints

**Steps:**
1. Fill device storage to 90% capacity
2. Attempt to install/update Jigyasu
3. Use app for 30 minutes
4. Check cache growth
5. Verify cache can be cleared

**Success Criteria:**
- App warns about storage
- Cache doesn't grow unbounded
- Cache can be cleared manually
- App functions with limited storage

---

### Scenario 5: Battery Performance

**Steps:**
1. Start with 100% battery
2. Use app for 1 hour continuous
3. Measure battery drain
4. Check for excessive CPU usage
5. Verify app doesn't overheat device

**Success Criteria:**
- Battery drain < 15% per hour
- CPU usage < 30% on average
- Device doesn't overheat
- No background battery drain

---

### Scenario 6: Screen Size Adaptation

**Steps:**
1. Test on smallest supported screen (4.5")
2. Test on largest supported screen (6")
3. Verify all UI elements are visible
4. Check touch target sizes
5. Verify text is readable

**Success Criteria:**
- No horizontal scrolling required
- Touch targets > 44px
- Text size > 12px
- No overlapping elements

---

### Scenario 7: Shared Device Mode

**Steps:**
1. Create 5 different learner profiles
2. Switch between profiles
3. Complete modules with different profiles
4. Verify progress is isolated
5. Test profile deletion

**Success Criteria:**
- Profile switching works smoothly
- Progress is correctly isolated
- No data leakage between profiles
- Profile deletion removes all data

---

### Scenario 8: Offline Functionality

**Steps:**
1. Load app with WiFi
2. Navigate to a module
3. Turn off WiFi/enable airplane mode
4. Complete the module
5. Turn WiFi back on
6. Verify progress syncs

**Success Criteria:**
- App works offline after initial load
- Progress saves locally
- No errors when offline
- Progress syncs when online

---

### Scenario 9: Accessibility Features

**Steps:**
1. Enable TalkBack screen reader
2. Navigate app using screen reader
3. Enable high-contrast mode
4. Test keyboard navigation (if external keyboard)
5. Verify all features work with accessibility

**Success Criteria:**
- All elements have proper labels
- Screen reader announces all actions
- High-contrast mode is usable
- Keyboard navigation is complete

---

### Scenario 10: Language Switching

**Steps:**
1. Set device language to Hindi
2. Launch app
3. Switch app language to Tamil
4. Navigate through modules
5. Verify translations are correct

**Success Criteria:**
- App respects device language
- Language switching works
- Translations are accurate
- No text overflow in any language

---

## Performance Benchmarks

### Load Times (2G Connection)

| Action | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| App Launch | 3s | 5s | 10s |
| Module Load | 5s | 8s | 15s |
| Phase Transition | 2s | 3s | 5s |
| Image Load | 1s | 2s | 4s |
| Progress Save | 1s | 2s | 5s |

### Memory Usage

| State | Target | Acceptable | Critical |
|-------|--------|------------|----------|
| Idle | 50MB | 80MB | 120MB |
| Module Active | 100MB | 150MB | 200MB |
| Peak | 150MB | 200MB | 250MB |

### Storage Usage

| Component | Target | Acceptable | Critical |
|-----------|--------|------------|----------|
| App Size | 30MB | 40MB | 50MB |
| Cache | 20MB | 30MB | 50MB |
| Data | 5MB | 10MB | 20MB |

## Automated Testing

### ADB Commands for Automated Tests

```bash
# Install APK
adb install -r jigyasu.apk

# Launch app
adb shell am start -n com.jigyasu.app/.MainActivity

# Measure launch time
adb shell am start -W com.jigyasu.app/.MainActivity

# Check memory usage
adb shell dumpsys meminfo com.jigyasu.app

# Check storage usage
adb shell pm path com.jigyasu.app

# Clear app data
adb shell pm clear com.jigyasu.app

# Uninstall app
adb uninstall com.jigyasu.app
```

### Performance Monitoring Script

```bash
#!/bin/bash
# monitor_performance.sh

DEVICE_ID=$1
APP_PACKAGE="com.jigyasu.app"

echo "Monitoring performance for $APP_PACKAGE on device $DEVICE_ID"

# Memory usage every 5 seconds
while true; do
  adb -s $DEVICE_ID shell dumpsys meminfo $APP_PACKAGE | grep "TOTAL:"
  sleep 5
done
```

## Common Issues and Solutions

### Issue: App Crashes on Launch

**Possible Causes:**
- Insufficient RAM
- Corrupted installation
- Android version incompatibility

**Solutions:**
1. Clear app data and cache
2. Reinstall app
3. Check Android version compatibility
4. Monitor logcat for crash details

```bash
adb logcat | grep "FATAL EXCEPTION"
```

### Issue: Slow Performance

**Possible Causes:**
- Background apps consuming resources
- Storage nearly full
- Network congestion

**Solutions:**
1. Close background apps
2. Clear device storage
3. Test on different network
4. Check CPU usage

```bash
adb shell top | grep $APP_PACKAGE
```

### Issue: Images Not Loading

**Possible Causes:**
- Network timeout
- Image size too large
- Cache corruption

**Solutions:**
1. Check network connection
2. Optimize image sizes
3. Clear app cache
4. Test with smaller images

### Issue: Screen Reader Not Working

**Possible Causes:**
- Missing ARIA labels
- Focus management issues
- TalkBack version incompatibility

**Solutions:**
1. Test with latest TalkBack
2. Add missing labels
3. Fix focus order
4. Test with different screen readers

## Reporting Results

### Test Report Template

```markdown
# Device Test Report

**Device:** Samsung Galaxy J2
**Android Version:** 5.1
**RAM:** 1.5GB
**Storage:** 8GB
**Test Date:** YYYY-MM-DD
**Tester:** Name

### Results Summary
- Total Scenarios: 10
- Passed: 8
- Failed: 2
- Blocked: 0

### Failed Scenarios
1. **Scenario 2: 2G Network Performance**
   - Issue: Module load time exceeded 10s
   - Severity: High
   - Steps to Reproduce: [details]
   - Screenshot: [attached]

2. **Scenario 7: Shared Device Mode**
   - Issue: Profile switching caused crash
   - Severity: Critical
   - Steps to Reproduce: [details]
   - Logcat: [attached]

### Performance Metrics
- App Launch Time: 4.2s (target: 3s)
- Module Load Time: 9.1s (target: 5s)
- Memory Usage (Idle): 65MB (target: 50MB)
- Storage Usage: 35MB (target: 30MB)

### Recommendations
1. Optimize module loading for 2G
2. Fix profile switching crash
3. Consider increasing minimum RAM requirement to 2GB
```

## Continuous Testing

### Weekly Testing
- Test on at least one low-end device
- Run automated performance tests
- Check for new Android version compatibility

### Monthly Testing
- Test on all target devices
- Full regression testing
- Performance benchmark comparison

### Quarterly Testing
- Add new devices to test matrix
- Update minimum requirements based on market data
- Review and update test scenarios

## Resources

### Device Farm Services
- **AWS Device Farm**: Real device testing in cloud
- **BrowserStack**: Cross-device testing
- **Firebase Test Lab**: Android device testing
- **Local Device Pool**: Maintain physical devices

### Documentation
- [Android Compatibility](https://developer.android.com/guide/topics/compatibility)
- [Android Performance](https://developer.android.com/topic/performance)
- [Android Testing](https://developer.android.com/training/testing)

---

*Device testing should be integrated into the CI/CD pipeline. All releases must pass low-end device testing before deployment. Last updated: May 2026*
