import { AdMob, BannerAdSize, BannerAdPosition, RewardAdPluginEvents } from '@capacitor-community/admob';

// 1. ID Quảng cáo Test của Google (Dùng để test an toàn không lo khóa acc)
const AD_IDS = {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224354917'
};

export async function initAdMob() {
    try {
        await AdMob.initialize({
            requestTrackingAuthorization: true,
            testingDevices: [],
            initializeForTesting: true,
        });

        // 🟢 Hiển thị Banner ở đáy màn hình
        showBanner();
        
        // 🟢 Chuẩn bị trước QC Cắt Cảnh (Interstitial)
        prepareInterstitial();
    } catch (e) {
        console.log("AdMob Init Error:", e);
    }
}

export async function showBanner() {
    try {
        await AdMob.showBanner({
            adId: AD_IDS.banner,
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0
        });
    } catch (e) {}
}

export async function prepareInterstitial() {
    try {
        await AdMob.prepareInterstitial({ adId: AD_IDS.interstitial });
    } catch (e) {}
}

export async function showInterstitial() {
    try {
        await AdMob.showInterstitial();
        prepareInterstitial(); // Chuẩn bị tiếp cho lần sau
    } catch (e) {
        prepareInterstitial();
    }
}

export async function showRewarded(onSuccess) {
    try {
        AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
            if (onSuccess) onSuccess();
        });

        await AdMob.prepareRewardVideoAd({ adId: AD_IDS.rewarded });
        await AdMob.showRewardVideoAd();
    } catch (e) {
        alert("Không thể tải quảng cáo lúc này. Thử lại sau!");
    }
}

// Đóng gói vào Window để index.html gọi dễ dàng
window.AdManager = {
    showBanner,
    showInterstitial,
    showRewarded
};

initAdMob();
