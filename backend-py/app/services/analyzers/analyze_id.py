import re
import pandas as pd
import numpy as np
from collections import Counter


def analyze_id(series: pd.Series) -> dict:
    """Analyze ID-like column for patterns"""
    series = series.dropna().astype(str)
    if series.empty:
        return {"error": "Empty series"}

    lengths = series.str.len()
    unique_count = series.nunique()
    total_count = len(series)

    # Character composition
    is_numeric = series.str.isnumeric().all()
    is_alpha = series.str.isalpha().all()
    is_alnum = series.str.isalnum().all()

    # Common prefix/suffix
    def longest_common_prefix(strings):
        if not strings:
            return ""
        s1, s2 = min(strings), max(strings)
        for i, c in enumerate(s1):
            if c != s2[i]:
                return s1[:i]
        return s1

    def longest_common_suffix(strings):
        rev = [s[::-1] for s in strings]
        return longest_common_prefix(rev)[::-1]

    prefix = longest_common_prefix(series.tolist())
    suffix = longest_common_suffix(series.tolist())

    # Detect UUID-like pattern
    uuid_pattern = re.compile(r"^[0-9a-fA-F\-]{36}$")
    uuid_like = series.apply(lambda x: bool(uuid_pattern.match(x))).mean() > 0.9

    # Detect hex-like pattern
    hex_pattern = re.compile(r"^[0-9a-fA-F]+$")
    hex_like = series.apply(lambda x: bool(hex_pattern.match(x))).mean() > 0.9

    # Sequential detection (if numeric only)
    sequential = False
    if is_numeric:
        nums = pd.to_numeric(series, errors="coerce")
        diffs = np.diff(np.sort(nums.dropna().unique()))
        if len(diffs) > 0 and (np.all(diffs == 1) or np.median(diffs) == 1):
            sequential = True

    return {
        "count": total_count,
        "unique_count": unique_count,
        "uniqueness_ratio": unique_count / total_count,
        "length_min": int(lengths.min()),
        "length_max": int(lengths.max()),
        "length_mean": float(lengths.mean()),
        "is_numeric": bool(is_numeric),
        "is_alpha": bool(is_alpha),
        "is_alphanumeric": bool(is_alnum),
        "common_prefix": prefix if prefix else None,
        "common_suffix": suffix if suffix else None,
        "uuid_like": bool(uuid_like),
        "hex_like": bool(hex_like),
        "sequential": bool(sequential),
        "example_values": series.head(5).tolist(),
    }