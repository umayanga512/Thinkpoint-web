#!/bin/bash

# CI/CD Performance Monitoring Script
# Monitors workflow performance and provides insights

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 CI/CD Performance Monitor${NC}"
echo "================================"

# Function to check workflow performance
check_workflow_performance() {
    echo -e "${YELLOW}📊 Recent Workflow Performance:${NC}"

    # Get recent workflow runs with timing info
    gh run list --limit 10 --json status,conclusion,createdAt,startedAt,completedAt,workflowName,duration \
    | jq -r '.[] | "\(.workflowName): \(.status)//\(.conclusion) - Duration: \(.duration // "N/A")s - \(.createdAt)"' \
    | head -10

    echo ""
}

# Function to analyze cache performance
check_cache_performance() {
    echo -e "${YELLOW}🗂️ Cache Performance Analysis:${NC}"

    # Check if cache hits are happening (this would require custom implementation)
    echo "Cache monitoring requires GitHub Actions API access for detailed metrics"
    echo "Consider implementing cache hit logging in workflows"
    echo ""
}

# Function to check Bun performance
check_bun_performance() {
    echo -e "${YELLOW}📦 Bun Performance Metrics:${NC}"

    # Check if Bun is properly configured
    if command -v bun &> /dev/null; then
        echo "✅ Bun version: $(bun --version)"

        # Test installation speed (simulate)
        echo "Testing dependency resolution speed..."
        time bun pm ls > /dev/null 2>&1 || echo "Dependency check completed"
    else
        echo "❌ Bun not found in PATH"
    fi
    echo ""
}

# Function to suggest optimizations
suggest_optimizations() {
    echo -e "${YELLOW}💡 Optimization Suggestions:${NC}"
    echo "1. Consider using matrix builds for parallel execution"
    echo "2. Implement self-hosted runners for cost optimization"
    echo "3. Add workflow concurrency controls"
    echo "4. Use GitHub Actions cache for dependencies"
    echo "5. Optimize Docker images if using containers"
    echo "6. Consider using bunx instead of npx for Node.js tools"
    echo ""
}

# Function to monitor security status
check_security_status() {
    echo -e "${YELLOW}🔒 Security Status:${NC}"

    if command -v bun &> /dev/null; then
        echo "Running security audit..."
        if bun audit --audit-level moderate 2>/dev/null; then
            echo "✅ No high/critical vulnerabilities found"
        else
            echo "⚠️ Security vulnerabilities detected - run 'bun audit' for details"
        fi
    fi
    echo ""
}

# Main execution
main() {
    echo "Analyzing CI/CD performance..."
    echo ""

    check_workflow_performance
    check_cache_performance
    check_bun_performance
    check_security_status
    suggest_optimizations

    echo -e "${GREEN}✅ Performance monitoring complete!${NC}"
    echo -e "${BLUE}💡 Tip: Run this script regularly to track performance trends${NC}"
}

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) is required but not installed.${NC}"
    echo "Install it from: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI authentication required.${NC}"
    echo "Run: gh auth login"
    exit 1
fi

main "$@"