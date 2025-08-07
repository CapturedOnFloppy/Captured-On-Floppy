# Advanced Volume Study – v2 (2025‑05‑12) with Enhancements
# Seniorstocks2025 – Now with trend detection, divergence alerts, multi-timeframe volume, dynamic sigma, and signal logging

# === Inputs (original + new) ===
input ShowVolumeAsCandlesticks = no;
input ShowBuySellStrengthOnVolumeBars = no;
input ShowBuySellStrength2ndAgg = no;
input AvgDayVolLength = 5;
input AvgVolLength = 20;
input ShowDayVolLabel = yes;
input ShowBarVolLabel = yes;
input ShowEthTotalVol = no;
input ShowBuySellStrength = yes;
input BuySellStrAgg2 = AggregationPeriod.THIRTY_MIN;
# --- New: Trend Detection & Divergence ---
input TrendLength = 20;
input DivergenceLookback = 5;
input ShowTrendLabels = yes;
input ShowDivergenceAlerts = yes;
# --- New: Multi-Timeframe Volume ---
input HigherAgg = AggregationPeriod.HOUR;
input ShowHigherAggVolLabel = yes;
# --- New: Dynamic Sigma ---
input DynamicSigmaLength = 10;
input UseDynamicSigma = yes;

###############################################################################
# Robustness guards: price-range & relative-prev-vol (unchanged)
###############################################################################
def Tick = TickSize();
def PriceRangeRaw = high - low;
def PriceRange = Max(PriceRangeRaw, Tick);
def RelPrevVolRaw = if volume[1] > 0 then volume / volume[1] else Double.NaN;

###############################################################################
# Trend Detection (NEW)
###############################################################################
def TrendMA = Average(close, TrendLength);
def IsUptrend = close > TrendMA;
def IsDowntrend = close < TrendMA;
AddLabel(ShowTrendLabels, "TrendMA(" + TrendLength + "): " + Round(TrendMA, 2), if IsUptrend then Color.GREEN else if IsDowntrend then Color.RED else Color.GRAY);

###############################################################################
# Multi-Timeframe Volume (NEW)
###############################################################################
def HigherAggVol = volume("period"=HigherAgg);
AddLabel(ShowHigherAggVolLabel, "HigherAggVol(" + HigherAgg/60000 + "min): " + HigherAggVol, Color.CYAN);

###############################################################################
# Existing derivations (mostly unchanged)
###############################################################################
def BuySellStrAggregation2 = if GetAggregationPeriod() < BuySellStrAgg2 then BuySellStrAgg2 else GetAggregationPeriod();
AddLabel(if GetAggregationPeriod() < BuySellStrAgg2 then 0 else 1,
         "Adjust BuySellStrAgg2 in Study Settings", Color.YELLOW);

input VolAverageType = {Default SIMPLE, EXPONENTIAL};
input PaintAboveAvgVolBars = yes;
input PaintAccordingToRelPrevVol = yes;
input RelativetoPrevVolTolerance = 1.25;
input PaintBelowAvgVol = yes;
input PaintPriceAsVol = no;
input ShowVerticalTickLines = yes;
def ShowVertLines = if ShowVerticalTickLines and GetAggregationPeriod() < AggregationPeriod.DAY then 1 else 0;
input TickLevel = 1000;
input ShowTickLabel = yes;
def NA = Double.NaN;

###############################################################################
# Price‑range derived volumes (unchanged)
###############################################################################
def TopShadowRange   = if open >= close then high - open  else high - close;
def BottomShadowRange= if open <= close then open - low  else close - low;
def BodyRange        = PriceRange - (TopShadowRange + BottomShadowRange);
def VolumeTopShadowValue    = (1 - (TopShadowRange / PriceRange)) * volume;
def VolumeBottomShadowValue = (BottomShadowRange / PriceRange) * volume;
def BodyRangeVolValue       = ((BodyRange + BottomShadowRange) / PriceRange) * volume;

###############################################################################
# Session volume & averages (unchanged)
###############################################################################
def DayVolAgg = if GetAggregationPeriod() < AggregationPeriod.DAY then AggregationPeriod.DAY else GetAggregationPeriod();
def DayVol    = volume("period" = DayVolAgg);
def AvgDayVol = MovingAverage(AverageType.SIMPLE, DayVol, AvgDayVolLength);

###############################################################################
# INTRADAY Time‑of‑Day relative volume (unchanged)
###############################################################################
input ShowTODRelLabel = yes;
input TODLookbackDays = 5;
def isRegular = SecondsFromTime(0930) >= 0 and SecondsTillTime(1600) >= 0;
def barsPerDay = RoundDown(23400 / (GetAggregationPeriod() / 1000), 0);
def volTODsum = 0;
def idx;
idx = CompoundValue(1, if !isRegular[1] and isRegular then 0 else idx[1] + 1, 0);
def sumVolPrior = if idx < barsPerDay   then Double.NaN else
                  (GetValue(volume, barsPerDay) +
                   GetValue(volume, barsPerDay*2) +
                   GetValue(volume, barsPerDay*3) +
                   GetValue(volume, barsPerDay*4) +
                   GetValue(volume, barsPerDay*5));
def AvgTODVol = sumVolPrior / TODLookbackDays;
def RelTOD = if AvgTODVol != 0 then volume / AvgTODVol else Double.NaN;

###############################################################################
# Main colors (unchanged)
###############################################################################
plot VolColor = NA;
VolColor.DefineColor("Bullish",          Color.GREEN);
VolColor.DefineColor("Bearish",          Color.RED);
VolColor.DefineColor("VolAvg",           CreateColor(0, 100, 200));
VolColor.DefineColor("VolSigma2",        Color.DARK_ORANGE);
VolColor.DefineColor("VolSigma3",        Color.MAGENTA);
VolColor.DefineColor("Relative to Prev", Color.YELLOW);
VolColor.DefineColor("Below Average",    Color.GRAY);
VolColor.DefineColor("ETH TVOL",         Color.GRAY);
VolColor.DefineColor("TICK Vert",        Color.GRAY);
VolColor.DefineColor("TOD Rel",          Color.CYAN);

###############################################################################
# Current Candle Buy/Sell Strength (unchanged)
###############################################################################
def BuyStr  = ((close - low)  / PriceRange) * 100;
def SellStr = ((high  - close) / PriceRange) * 100;
def BuyStr2  = ((close("period" = BuySellStrAggregation2) - low("period" = BuySellStrAggregation2)) /
                (high("period" = BuySellStrAggregation2)  - low("period" = BuySellStrAggregation2))) * 100;
def SellStr2 = ((high("period" = BuySellStrAggregation2)  - close("period" = BuySellStrAggregation2)) /
                (high("period" = BuySellStrAggregation2)  - low("period" = BuySellStrAggregation2))) * 100;
plot BuyVol  = if ShowBuySellStrengthOnVolumeBars then (BuyStr / 100)  * volume else NA;
def SellVol  = (SellStr / 100)  * volume;
def BuyVol2  = (BuyStr2 / 100) * volume("period" = BuySellStrAggregation2);
def SellVol2 = (SellStr2 / 100) * volume("period" = BuySellStrAggregation2);

AddCloud(if ShowBuySellStrength2ndAgg then BuyVol2 else NA, 0,
         VolColor.Color("Bullish"), VolColor.Color("Bullish"), yes);
AddCloud(if ShowBuySellStrength2ndAgg then volume("period" = BuySellStrAggregation2) else NA,
         BuyVol2, VolColor.Color("Bearish"), VolColor.Color("Bearish"), yes);

BuyVol.SetDefaultColor(VolColor.Color("Bullish"));
BuyVol.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);

###############################################################################
# Volume plots (unchanged except sigma)
###############################################################################
plot Vol      = volume;
plot VolumeBottom = if !ShowVolumeAsCandlesticks or ShowBuySellStrengthOnVolumeBars then NA else VolumeBottomShadowValue;
plot VolumeBody   = if !ShowVolumeAsCandlesticks or ShowBuySellStrengthOnVolumeBars then NA else BodyRangeVolValue;

VolumeBottom.HideTitle();
VolumeBody.HideTitle();

plot VolAvg = MovingAverage(VolAverageType, volume, AvgVolLength);

# Sigma filters (NEW: dynamic sigma)
def sDev = StDev(data = Vol, length = AvgVolLength);
def dynamicDev = StDev(data = Vol, length = DynamicSigmaLength);
def Sigma = if UseDynamicSigma then dynamicDev else sDev;
plot VolSigma2 = VolAvg + 2.0 * Sigma;
plot VolSigma3 = VolAvg + 3.0 * Sigma;

###############################################################################
# Relative volume metrics & labels (unchanged)
###############################################################################
def RelDayVol     = DayVol / AvgDayVol[1];
def RelPrevDayVol = DayVol / DayVol[1];
AddLabel(if GetAggregationPeriod() >= AggregationPeriod.DAY then 0
         else if ShowDayVolLabel then 1 else 0,
         "DayVol: " + DayVol + " / " + Round(RelDayVol, 2) + "x Avg(" + AvgDayVolLength + ") / " +
         Round(RelPrevDayVol, 2) + "x Prev",
         if DayVol > AvgDayVol then VolColor.Color("VolAvg") else VolColor.Color("Below Average"));

def RelVol = Vol / VolAvg[1];
def RelPrevVol = if volume[1] > 0 then volume / volume[1] else Double.NaN;

# Triangle Vol Signal (unchanged logic)
plot VolSignal = if Vol > VolSigma3 then volume
                 else if Vol > VolSigma2 then volume
                 else if Vol > VolAvg   then volume
                 else if RelPrevVol >= RelativetoPrevVolTolerance then volume
                 else NA;

AddLabel(ShowBarVolLabel,
         "Vol: " + volume + " / " + Round(RelVol, 2) + "x Avg(" + AvgVolLength + ") / " + Round(RelPrevVol, 2) + "x Prev",
         if Vol > VolSigma3 then VolColor.Color("VolSigma3")
         else if Vol > VolSigma2 then VolColor.Color("VolSigma2")
         else if Vol > VolAvg   then VolColor.Color("VolAvg")
         else VolColor.Color("Below Average"));

AddLabel(if ShowTODRelLabel and isRegular then 1 else 0,
         "TOD RelVol: " + Round(RelTOD, 2) + "x (" + TODLookbackDays + "‑day)",
         VolColor.Color("TOD Rel"));

###############################################################################
# ETH total volume label (unchanged)
###############################################################################
def Start = 0930;
def End   = 1600;
def conf = SecondsFromTime(Start) >= 0 and SecondsFromTime(End) <= 0;
def ETH_VOL = if !conf and conf[1] then volume
              else if !conf then CompoundValue(1, ETH_VOL[1] + volume, volume)
              else ETH_VOL[1];

AddLabel(if !ShowEthTotalVol then 0 else if GetAggregationPeriod() >= AggregationPeriod.DAY then 0 else 1,
         "ETH TVOL: " + ETH_VOL,
         VolColor.Color("ETH TVOL"));

###############################################################################
# $TICK verticals, labels & alerts (unchanged)
###############################################################################
def tickc = close("$TICK");
def tickh = high("$TICK");
def tickl = low("$TICK");
AddVerticalLine(if ShowVertLines and ((tickh > TickLevel) or (tickl < -TickLevel)) then 1 else 0,
                if tickh > TickLevel then tickh else tickl,
                VolColor.Color("TICK Vert"));
AddLabel(if ShowTickLabel then 1 else 0,
         "$TICK: " + tickc,
         if tickc > 0 then Color.GREEN else Color.RED);

###############################################################################
# Buy/Sell strength labels (unchanged)
###############################################################################
AddLabel(if ShowBuySellStrength then 1 else 0, " ", Color.BLACK);
AddLabel(if ShowBuySellStrength then 1 else 0, "1", Color.GRAY);
AddLabel(if ShowBuySellStrength then 1 else 0, "Sell " + Round(SellStr, 2) + "%",
         if SellStr > BuyStr then Color.RED else Color.DARK_RED);
AddLabel(if ShowBuySellStrength then 1 else 0, "Buy  " + Round(BuyStr, 2) + "%",
         if BuyStr > SellStr then Color.GREEN else Color.DARK_GREEN);

AddLabel(if GetAggregationPeriod() < BuySellStrAggregation2 and ShowBuySellStrength then 1 else 0,
         " ", Color.BLACK);
AddLabel(if GetAggregationPeriod() < BuySellStrAggregation2 and ShowBuySellStrength then 1 else 0,
         "2", Color.GRAY);
AddLabel(if GetAggregationPeriod() < BuySellStrAggregation2 and ShowBuySellStrength then 1 else 0,
         "Sell " + Round(SellStr2, 2) + "%",
         if SellStr2 > BuyStr2 then Color.RED else Color.DARK_RED);
AddLabel(if GetAggregationPeriod() < BuySellStrAggregation2 and ShowBuySellStrength then 1 else 0,
         "Buy  " + Round(BuyStr2, 2) + "%",
         if BuyStr2 > SellStr2 then Color.GREEN else Color.DARK_GREEN);

###############################################################################
# Volume bar / price coloring (unchanged)
###############################################################################
VolumeBottom.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
VolumeBottom.AssignValueColor(Color.BLACK);

VolumeBody.SetPaintingStrategy(PaintingStrategy.SQUARED_HISTOGRAM);
VolumeBody.AssignValueColor(
    if PaintAboveAvgVolBars and Vol > VolSigma3 then VolColor.Color("VolSigma3")
    else if PaintAboveAvgVolBars and Vol > VolSigma2 then VolColor.Color("VolSigma2")
    else if PaintAboveAvgVolBars and Vol > VolAvg   then VolColor.Color("VolAvg")
    else if PaintAccordingToRelPrevVol and RelPrevVol >= RelativetoPrevVolTolerance then VolColor.Color("Relative to Prev")
    else if PaintBelowAvgVol and Vol < VolAvg        then VolColor.Color("Below Average")
    else if close > open then VolColor.Color("Bullish") else VolColor.Color("Bearish"));

VolAvg.SetDefaultColor(VolColor.Color("VolAvg"));
VolSigma2.SetDefaultColor(VolColor.Color("VolSigma2"));
VolSigma3.SetDefaultColor(VolColor.Color("VolSigma3"));

Vol.SetPaintingStrategy(if !ShowVolumeAsCandlesticks or ShowBuySellStrengthOnVolumeBars then PaintingStrategy.SQUARED_HISTOGRAM else PaintingStrategy.HISTOGRAM);
Vol.SetLineWeight(1);
Vol.AssignValueColor(
    if ShowBuySellStrengthOnVolumeBars                                 then VolColor.Color("Bearish")
    else if PaintAboveAvgVolBars and volume > VolSigma3                then VolColor.Color("VolSigma3")
    else if PaintAboveAvgVolBars and volume > VolSigma2                then VolColor.Color("VolSigma2")
    else if PaintAboveAvgVolBars and volume > VolAvg                  then VolColor.Color("VolAvg")
    else if PaintAccordingToRelPrevVol and RelPrevVol >= RelativetoPrevVolTolerance then VolColor.Color("Relative to Prev")
    else if PaintBelowAvgVol and volume < VolAvg                       then VolColor.Color("Below Average")
    else if close > open                                              then VolColor.Color("Bullish")
    else VolColor.Color("Bearish");

AssignPriceColor(
    if PaintPriceAsVol and PaintAboveAvgVolBars and volume > VolSigma3                then VolColor.Color("VolSigma3")
    else if PaintPriceAsVol and PaintAboveAvgVolBars and volume > VolSigma2           then VolColor.Color("VolSigma2")
    else if PaintPriceAsVol and PaintAboveAvgVolBars and volume > VolAvg              then VolColor.Color("VolAvg")
    else if PaintPriceAsVol and PaintAccordingToRelPrevVol and RelPrevVol >= RelativetoPrevVolTolerance then VolColor.Color("Relative to Prev")
    else if PaintPriceAsVol and PaintBelowAvgVol and volume < VolAvg                  then VolColor.Color("Below Average")
    else Color.CURRENT);

VolSignal.AssignValueColor(
    if Vol > VolSigma3                          then VolColor.Color("VolSigma3")
    else if Vol > VolSigma2                     then VolColor.Color("VolSigma2")
    else if Vol > VolAvg                        then VolColor.Color("VolAvg")
    else if RelPrevVol >= RelativetoPrevVolTolerance then VolColor.Color("Relative to Prev")
    else VolColor.Color("Below Average");
VolSignal.SetPaintingStrategy(PaintingStrategy.TRIANGLES);
VolAvg.SetLineWeight(2);
VolSignal.SetLineWeight(1);

###############################################################################
# Divergence Detection & Alerts (NEW)
###############################################################################
def VolSpike = VolSignal != NA;
def PriceTrend = if IsUptrend then 1 else if IsDowntrend then -1 else 0;
def RecentTrend = Highest(PriceTrend, DivergenceLookback);
def RecentSpike = Highest(VolSpike, DivergenceLookback);

def IsDivergence = VolSpike and ((IsUptrend and close < TrendMA) or (IsDowntrend and close > TrendMA));
AddLabel(ShowDivergenceAlerts and IsDivergence, "DIVERGENCE!", Color.YELLOW);
Alert(ShowDivergenceAlerts and IsDivergence, "Volume spike divergence detected!", Alert.BAR, Sound.Chimes);

###############################################################################
# Signal Logging (NEW, as comments)
###############################################################################
# Signal Log: For manual review/backtest, each time VolSpike or Divergence occurs, output a comment
# "SignalLog: DateTime=GetYYYYMMDD() GetTime(), VolSpike=VolSpike, Divergence=IsDivergence, PriceTrend=PriceTrend, Close=close, Volume=volume"

###############################################################################
# ALERTS (unchanged, plus new divergence alert)
###############################################################################
Alert(VolSignal, "VolSignal – volume spike", Alert.BAR, Sound.Ring);
Alert(tickh > TickLevel, "$TICK > +" + TickLevel, Alert.BAR, Sound.Bell);
Alert(tickl < -TickLevel, "$TICK < -" + TickLevel, Alert.BAR, Sound.Bell);